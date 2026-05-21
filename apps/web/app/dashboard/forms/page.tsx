import {
  IconBrandGoogleAnalytics,
  IconClipboardText,
  IconDeviceFloppy,
  IconEye,
  IconPlus,
  IconShare3,
} from "@tabler/icons-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

const formRows = [
  {
    name: "SaaS signup intake",
    owner: "Growth",
    status: "Live",
    submissions: "1,284",
    conversion: "32%",
    progress: 82,
  },
  {
    name: "Demo request",
    owner: "Sales",
    status: "Review",
    submissions: "468",
    conversion: "24%",
    progress: 64,
  },
  {
    name: "Customer onboarding",
    owner: "Success",
    status: "Draft",
    submissions: "96",
    conversion: "18%",
    progress: 41,
  },
];

const fields = [
  "Company name",
  "Work email",
  "Team size",
  "Primary use case",
  "Implementation timeline",
];

export default function FormsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6 @3xl/main:flex-row @3xl/main:items-center @3xl/main:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Forms</h2>
          <p className="text-sm text-muted-foreground">
            Build and monitor the forms that feed your dashboard pipeline.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <IconShare3 />
            Share
          </Button>
          <Button size="sm">
            <IconPlus />
            New form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Total forms</CardDescription>
            <CardTitle className="text-2xl font-semibold">18</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Live forms</CardDescription>
            <CardTitle className="text-2xl font-semibold">11</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Submissions</CardDescription>
            <CardTitle className="text-2xl font-semibold">2,904</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Avg. conversion</CardDescription>
            <CardTitle className="text-2xl font-semibold">26%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @5xl/main:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconClipboardText className="size-4" />
              Form performance
            </CardTitle>
            <CardDescription>
              The same dashboard frame now supports the form workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6">
            {formRows.map((form) => (
              <div
                key={form.name}
                className="grid gap-3 rounded-lg border p-4 @3xl/main:grid-cols-[minmax(0,1fr)_110px_110px_120px]"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{form.name}</p>
                    <Badge variant="outline">{form.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{form.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submissions</p>
                  <p className="text-sm font-medium">{form.submissions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                  <p className="text-sm font-medium">{form.conversion}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Completion</p>
                  <Progress value={form.progress} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconBrandGoogleAnalytics className="size-4" />
              Publish settings
            </CardTitle>
            <CardDescription>Control where the form sends data.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Select defaultValue="dashboard">
                <SelectTrigger id="destination" className="w-full">
                  <SelectValue placeholder="Select a destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard pipeline</SelectItem>
                  <SelectItem value="crm">CRM queue</SelectItem>
                  <SelectItem value="email">Email digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Public URL slug</Label>
              <Input id="slug" defaultValue="saas-signup-intake" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="notify" defaultChecked />
              <Label htmlFor="notify" className="text-sm font-normal">
                Notify the team for new qualified submissions
              </Label>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <IconEye />
                Preview
              </Button>
              <Button size="sm">
                <IconDeviceFloppy />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 px-4 lg:px-6 @5xl/main:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Builder</CardTitle>
            <CardDescription>Arrange the intake fields for this form.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-6">
            {fields.map((field, index) => (
              <div
                key={field}
                className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{field}</p>
                  <p className="text-xs text-muted-foreground">
                    Step {index + 1} of {fields.length}
                  </p>
                </div>
                <Badge variant={index < 2 ? "default" : "secondary"}>
                  {index < 2 ? "Required" : "Optional"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Live preview</CardTitle>
            <CardDescription>
              Review the form exactly where the dashboard shell renders it.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company name</Label>
                <Input id="company" placeholder="Acme Software" />
              </div>
              <div className="grid gap-2 @3xl/main:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="name@company.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team-size">Team size</Label>
                  <Select>
                    <SelectTrigger id="team-size" className="w-full">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201+">201+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="use-case">Primary use case</Label>
                <Textarea id="use-case" placeholder="Tell us what workflow you want to improve." />
              </div>
              <Button type="button" className="w-fit">
                Submit preview
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
