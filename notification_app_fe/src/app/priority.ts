export type Notif = {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
};

export function getNotif(
  notifications: Notif[],
  limit = 10,
) {
  const priority: Record<string, number> = {
    placement: 3,
    result: 2,
    event: 1,
  };

  const score = (n: Notif) => {
    const type = (n.Type || "").toLowerCase();
    const p = priority[type] || 0;
    const t = Date.parse(n.Timestamp.replace(" ", "T")) || 0;
    return { p, t };
  };

  return [...notifications]
    .sort((a, b) => {
      const A = score(a);
      const B = score(b);
      if (B.p !== A.p) return B.p - A.p; 
      return B.t - A.t; 
    })
    .slice(0, limit);
}
