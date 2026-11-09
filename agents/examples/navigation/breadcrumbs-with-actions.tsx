import {
  Badge,
  Breadcrumb,
  BreadcrumbList,
  Button,
  Grid,
  Heading,
  Stack,
  Text,
} from "@gunkin/uiify";

const facts = [
  ["Owner", "Ada Lovelace"],
  ["Due", "Dec 12, 2026"],
  ["Tasks", "14 open · 32 done"],
  ["Team", "Design, Web"],
];

export default function BreadcrumbsWithActions() {
  return (
    <Stack gap="lg" container className="mx-auto w-full max-w-5xl">
      <Stack gap="sm">
        <Breadcrumb>
          <BreadcrumbList
            items={[
              { key: "home", href: "/", label: "Home" },
              { key: "projects", href: "/projects", label: "Projects" },
              { key: "orbit", current: true, label: "Orbit launch" },
            ]}
          />
        </Breadcrumb>
        <Stack
          direction={{ base: "block", md: "inline" }}
          justify="between"
          align={{ base: "start", md: "center" }}
          gap="md"
        >
          <Stack gap="xs">
            <Stack direction="inline" gap="sm" align="center">
              <Heading level={1}>Orbit launch</Heading>
              <Badge variant="success">On track</Badge>
            </Stack>
            <Text tone="muted">Updated 2 hours ago by Grace Hopper</Text>
          </Stack>
          <Stack direction="inline" gap="sm">
            <Button href="/projects/orbit/share" variant="outline">
              Share
            </Button>
            <Button href="/projects/orbit/edit">Edit project</Button>
          </Stack>
        </Stack>
      </Stack>
      <Grid as="section" aria-label="Project facts" columns={{ base: 2, md: 4 }} gap="md">
        {facts.map(([term, detail]) => (
          <Stack key={term} gap="xs">
            <Text size="sm" tone="muted">
              {term}
            </Text>
            <Text weight="medium">{detail}</Text>
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}
