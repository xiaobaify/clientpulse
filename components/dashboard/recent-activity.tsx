import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/lib/types";
import { UserPlus, FolderSync, CreditCard, Upload } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  user_signup: UserPlus,
  project_update: FolderSync,
  subscription: CreditCard,
  file_upload: Upload,
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近活动</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="rounded-full bg-muted p-2">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
