export type DepositAsset = "USDT-TRC20" | "USDT-BEP20";

export interface DepositChange {
  asset: DepositAsset;
  depositAddress: string;
  qrImageData: string;
  network: string;
  explorerUrl: string;
}

// The admin UI uploads the QR as a base64 image data URI (FileReader.readAsDataURL)
const QR_DATA_URI = /^data:image\/([a-z0-9.+-]+);base64,/i;

// Validates an admin deposit-settings request body. Returns an error message on invalid input.
export function parseDepositChange(body: any): DepositChange | string {
  const { depositAddress, qrImageData, network, explorerUrl } = body ?? {};
  const asset: DepositAsset = body?.asset === "USDT-BEP20" ? "USDT-BEP20" : "USDT-TRC20";

  if (!depositAddress || typeof depositAddress !== "string" || depositAddress.trim() === "") {
    return "Please enter a valid deposit wallet address.";
  }

  if (!qrImageData || typeof qrImageData !== "string" || !QR_DATA_URI.test(qrImageData)) {
    return "Please upload a QR Code image file.";
  }

  return {
    asset,
    depositAddress: depositAddress.trim(),
    qrImageData,
    network:
      (typeof network === "string" && network.trim()) ||
      (asset === "USDT-BEP20" ? "Binance Smart Chain (BEP20)" : "TRON Network (TRC20)"),
    explorerUrl:
      (typeof explorerUrl === "string" && explorerUrl.trim()) ||
      (asset === "USDT-BEP20" ? "https://bscscan.com" : "https://tronscan.org"),
  };
}

// Ties an email OTP to one exact change, so a code cannot approve different details
export function depositChangeFingerprint(change: DepositChange): string {
  return [change.asset, change.depositAddress, change.network, change.explorerUrl, change.qrImageData].join("|");
}

export function depositChangeSummary(change: DepositChange): string {
  return [
    `Asset: ${change.asset}`,
    `Network: ${change.network}`,
    `New wallet address: ${change.depositAddress}`,
    `The new QR code image is attached. Check that it matches the address above.`,
  ].join("\n");
}

// Attach the QR image so the admin can see exactly what users will scan
export function depositQrAttachment(change: DepositChange) {
  const extension = change.qrImageData.match(/^data:image\/(\w+)/i)?.[1] || "png";
  return { filename: `deposit-qr-${change.asset}.${extension}`, path: change.qrImageData };
}
