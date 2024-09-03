export interface StartPayload {
  referrerId: number;
  squadId?: number;
}

export function parseStartPayload(startPayloadData: string): StartPayload | null {
  if (startPayloadData.length === 0) {
    return null;
  }

  if (/^\d+$/.test(startPayloadData)) {
    return parseReferrerId(startPayloadData);
  }

  return parseReferrerIdAndSquadId(startPayloadData);
}

function parseReferrerId(startPayloadData: string): StartPayload | null {
  const referrerId = parseInt(startPayloadData, 10);
  if (isNaN(referrerId)) {
    return null;
  }
  return {
    referrerId,
    squadId: undefined,
  };
}

function parseReferrerIdAndSquadId(startPayloadData: string): StartPayload | null {
  const match = startPayloadData.match(/^(\d+)_(\d+)$/);
  if (match === null) {
    return null;
  }
  const [, squadIdStr, referrerIdStr] = match;

  const squadId = parseInt(squadIdStr, 10);
  if (isNaN(squadId)) {
    return null;
  }
  const referrerId = parseInt(referrerIdStr, 10);
  if (isNaN(referrerId)) {
    return null;
  }

  return { referrerId, squadId };
}
