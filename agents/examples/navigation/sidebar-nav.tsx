import {
  Badge,
  Button,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  Heading,
  Stack,
  Text,
} from "@gunkin/uiify";

const groups = [
  {
    title: "Workspace",
    links: [
      ["Overview", "/"],
      ["Projects", "/projects"],
      ["Reports", "/reports"],
    ],
  },
  {
    title: "Settings",
    links: [
      ["Team", "/team"],
      ["Billing", "/billing"],
    ],
  },
];

const projects = [
  { name: "Orbit launch", note: "14 open tasks", status: "On track" },
  { name: "Billing revamp", note: "Due Nov 20", status: "At risk" },
];

export default function SidebarNav() {
  return (
    <Grid
      columns={{ base: 1, md: "sidebar" }}
      responsive="viewport"
      gap="lg"
      container
      className="w-full"
    >
      <Stack as="nav" gap="lg" padding="md" aria-label="Sidebar">
        <Text size="lg" weight="semibold">
          Acme
        </Text>
        {groups.map((group) => (
          <Stack key={group.title} gap="xs" align="start">
            <Text size="xs" tone="muted" weight="medium">
              {group.title}
            </Text>
            {group.links.map(([label, href]) => (
              <Button
                key={href}
                href={href}
                variant="ghost"
                size="sm"
                aria-current={href === "/projects" ? "page" : undefined}
              >
                {label}
              </Button>
            ))}
          </Stack>
        ))}
      </Stack>
      <Stack as="main" gap="lg" padding="md">
        <Stack direction="inline" justify="between" align="center" gap="md">
          <Stack gap="xs">
            <Heading level={1}>Projects</Heading>
            <Text tone="muted">12 projects · 2 need attention</Text>
          </Stack>
          <Button href="/projects/new" size="sm">
            New project
          </Button>
        </Stack>
        <Grid columns={{ base: 1, md: 2 }} gap="md">
          {projects.map((project) => (
            <Card key={project.name} size="sm">
              <CardHeader>
                <CardTitle as="h2">{project.name}</CardTitle>
                <CardDescription>{project.note}</CardDescription>
                <CardAction>
                  <Badge variant={project.status === "On track" ? "success" : "warning"}>
                    {project.status}
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Grid>
  );
}
