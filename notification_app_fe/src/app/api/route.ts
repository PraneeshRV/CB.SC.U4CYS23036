import { sendLog } from "../logging_middleware";
import { getNotif } from "../priority";

const NOTIFICATION_API_URL =
  "http://20.207.122.201/evaluation-service/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  await sendLog("frontend", "info", "api", "started fetching notifications");

  try {
    const token = (globalThis as any)?.process?.env?.TOKEN || "";

    const response = await fetch(NOTIFICATION_API_URL, {
      headers: {
        Authorization: token,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      await sendLog(
        "frontend",
        "error",
        "api",
        `notification api failed with status ${response.status}`,
      );

      return Response.json(
        { error: "Could not load notifications" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const notifications = Array.isArray(data?.notifications) ? data.notifications : [];
    const topNotifications = getNotif(notifications, 10);

    await sendLog(
      "frontend",
      "info",
      "api",
      `selected top ${topNotifications.length} from ${notifications.length} notifications`,
    );

    return Response.json({
      notifications: topNotifications,
      totalCount: notifications.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    await sendLog("frontend", "fatal", "api", "notification fetch crashed");

    return Response.json(
      { error: "Something went wrong while loading notifications" },
      { status: 500 },
    );
  }
}
