import User from "@/models/User";
import Wallet from "@/models/Wallet";
import IncomeLog from "@/models/IncomeLog";
import ReferralSetting, { IReferralSetting } from "@/models/ReferralSetting";

export interface ProcessCommissionParams {
  userId: string;
  transactionType: "deposit" | "sell";
  amountInINR: number;
  asset: string;
  referenceId: string;
}

export async function processReferralCommissions({
  userId,
  transactionType,
  amountInINR,
  asset,
  referenceId,
}: ProcessCommissionParams) {
  try {
    if (!amountInINR || amountInINR <= 0) return;

    // 1. Fetch or initialize Referral Settings
    let settings = await ReferralSetting.findOne();
    if (!settings) {
      settings = await ReferralSetting.create({
        levels: [
          { level: 1, percentage: 5 },
          { level: 2, percentage: 3 },
          { level: 3, percentage: 1 },
        ],
        isDepositCommissionEnabled: true,
        isSellCommissionEnabled: true,
      });
    }

    if (transactionType === "deposit" && !settings.isDepositCommissionEnabled) {
      return;
    }
    if (transactionType === "sell" && !settings.isSellCommissionEnabled) {
      return;
    }

    if (!settings.levels || settings.levels.length === 0) return;

    // 2. Fetch the actor user
    const actorUser = await User.findOne({ userId });
    if (!actorUser || !actorUser.referralId) return;

    let currentSponsorId = actorUser.referralId;
    const sortedLevels = [...settings.levels].sort((a, b) => a.level - b.level);

    for (const levelConfig of sortedLevels) {
      if (!currentSponsorId) break;

      const sponsor = await User.findOne({ userId: currentSponsorId });
      if (!sponsor) break;

      const percentage = levelConfig.percentage;
      if (percentage > 0) {
        const commissionAmount = Number(((amountInINR * percentage) / 100).toFixed(2));

        if (commissionAmount > 0) {
          // Credit sponsor wallet
          let sponsorWallet = await Wallet.findOne({ userId: currentSponsorId });
          if (!sponsorWallet) {
            sponsorWallet = await Wallet.create({ userId: currentSponsorId });
          }

          sponsorWallet.inrBalance = (sponsorWallet.inrBalance || 0) + commissionAmount;
          sponsorWallet.levelIncome = (sponsorWallet.levelIncome || 0) + commissionAmount;
          sponsorWallet.totalIncome = (sponsorWallet.totalIncome || 0) + commissionAmount;
          await sponsorWallet.save();

          // Create Income Audit Log
          await IncomeLog.create({
            userId: currentSponsorId,
            fromUserId: userId,
            amount: commissionAmount,
            level: levelConfig.level,
            type: "level",
            asset,
            transactionAmount: amountInINR,
            referenceTxId: referenceId,
          });
        }
      }

      // Move up to next sponsor in chain
      currentSponsorId = sponsor.referralId || "";
    }
  } catch (error) {
    console.error("Error processing referral commissions:", error);
  }
}
