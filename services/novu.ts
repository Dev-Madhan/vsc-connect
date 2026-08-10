import { Novu } from '@novu/node';
import { env } from '@/lib/env';
import * as Sentry from "@sentry/nextjs";

const novu = new Novu(env.NOVU_API_KEY);

export const triggerNotification = async (
  workflowId: string, 
  subscriberId: string, 
  payload: Record<string, any>
) => {
  try {
    await novu.trigger(workflowId, {
      to: {
        subscriberId,
      },
      payload,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("[NovuService Error]", error);
    throw new Error("Failed to trigger notification");
  }
};
