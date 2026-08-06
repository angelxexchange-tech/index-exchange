import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import Transaction from "@/models/Transaction";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, destination, asset = "USDT", amount } = body;

    const numAmount = Number(amount);

    if (!userId || !destination || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid transfer parameters. Please enter a valid recipient and amount." },
        { status: 400 }
      );
    }

    const cleanDestination = String(destination).trim();

    await connectToDatabase();

    // 1. Fetch Sender User & Wallet
    const sender = await User.findOne({ userId });
    if (!sender) {
      return NextResponse.json(
        { success: false, message: "Sender user account not found." },
        { status: 404 }
      );
    }

    let senderWallet = await Wallet.findOne({ userId });
    if (!senderWallet) {
      senderWallet = await Wallet.create({ userId });
    }

    // Determine target balance field based on asset
    let balanceKey: "usdtBalance" | "usdtBep20Balance" = "usdtBalance";
    if (asset === "USDT-BEP20") balanceKey = "usdtBep20Balance";
    else balanceKey = "usdtBalance";

    const currentSenderBalance = senderWallet[balanceKey] || 0;

    if (currentSenderBalance < numAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient ${asset} balance. Available: ${currentSenderBalance} ${asset}`,
        },
        { status: 400 }
      );
    }

    // 2. Prevent self-transfer
    if (
      cleanDestination.toUpperCase() === sender.userId.toUpperCase() ||
      cleanDestination === sender.mobileNumber
    ) {
      return NextResponse.json(
        { success: false, message: "Self-transfer is not allowed." },
        { status: 400 }
      );
    }

    // 3. Search for Internal Recipient
    const recipient = await User.findOne({
      $or: [
        { userId: cleanDestination },
        { mobileNumber: cleanDestination },
        { userId: { $regex: new RegExp(`^${cleanDestination}$`, "i") } },
      ],
    });

    const refId = `TR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (recipient) {
      // --- INTERNAL P2P INSTANT TRANSFER ---
      let recipientWallet = await Wallet.findOne({ userId: recipient.userId });
      if (!recipientWallet) {
        recipientWallet = await Wallet.create({ userId: recipient.userId });
      }

      // Deduct from Sender
      senderWallet[balanceKey] = (senderWallet[balanceKey] || 0) - numAmount;
      await senderWallet.save();

      // Credit to Recipient
      recipientWallet[balanceKey] = (recipientWallet[balanceKey] || 0) + numAmount;
      await recipientWallet.save();

      // Create Sender Transaction record
      const senderTxn = await Transaction.create({
        userId,
        type: "transfer",
        asset,
        amount: numAmount,
        status: "completed",
        address: `Internal: ${recipient.name} (${recipient.userId})`,
        referenceId: refId,
      });

      // Create Recipient Transaction record
      const recipientRefId = `DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await Transaction.create({
        userId: recipient.userId,
        type: "deposit",
        asset,
        amount: numAmount,
        status: "completed",
        address: `Internal P2P from ${sender.name} (${sender.userId})`,
        referenceId: recipientRefId,
      });

      return NextResponse.json({
        success: true,
        isInternal: true,
        message: `Internal P2P transfer of ${numAmount} ${asset} to ${recipient.name} (${recipient.userId}) completed instantly!`,
        wallet: {
          [balanceKey]: senderWallet[balanceKey],
        },
        transaction: {
          _id: senderTxn._id.toString(),
          referenceId: senderTxn.referenceId,
          amount: numAmount,
          asset,
          status: senderTxn.status,
          address: senderTxn.address,
          createdAt: senderTxn.createdAt,
        },
      });
    } else {
      // --- EXTERNAL WALLET TRANSFER (ADMIN APPROVAL PENDING) ---
      // Deduct from Sender and hold pending approval
      senderWallet[balanceKey] = (senderWallet[balanceKey] || 0) - numAmount;
      await senderWallet.save();

      const externalTxn = await Transaction.create({
        userId,
        type: "transfer",
        asset,
        amount: numAmount,
        status: "pending",
        address: cleanDestination,
        referenceId: refId,
      });

      return NextResponse.json({
        success: true,
        isInternal: false,
        message: `External transfer request of ${numAmount} ${asset} to ${cleanDestination} submitted for Admin approval!`,
        wallet: {
          [balanceKey]: senderWallet[balanceKey],
        },
        transaction: {
          _id: externalTxn._id.toString(),
          referenceId: externalTxn.referenceId,
          amount: numAmount,
          asset,
          status: externalTxn.status,
          address: externalTxn.address,
          createdAt: externalTxn.createdAt,
        },
      });
    }
  } catch (error: any) {
    console.error("Transfer POST Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process transfer request." },
      { status: 500 }
    );
  }
}
