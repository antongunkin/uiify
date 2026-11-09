import {
  Box,
  Button,
  Card,
  CardContent,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
  Field,
  FieldLabel,
  Input,
  Stack,
} from "@gunkin/uiify";

export default function EmptySearch() {
  return (
    <Stack gap="lg" className="mx-auto w-full max-w-2xl">
      <Stack
        as="form"
        action="/search"
        method="get"
        role="search"
        direction="inline"
        gap="sm"
        align="end"
      >
        <Box grow={1}>
          <Field>
            <FieldLabel htmlFor="search-query">Search projects</FieldLabel>
            <Input id="search-query" name="q" type="search" defaultValue="orbitt" />
          </Field>
        </Box>
        <Button type="submit">Search</Button>
      </Stack>
      <Card>
        <CardContent>
          <Empty>
            <EmptyTitle>No results for “orbitt”</EmptyTitle>
            <EmptyDescription>Check the spelling or try a shorter word.</EmptyDescription>
            <EmptyContent>
              <Stack direction="inline" gap="sm" justify="center" wrap>
                <Button href="/search" variant="ghost">
                  Clear search
                </Button>
                <Button href="/projects" variant="outline">
                  Browse all projects
                </Button>
              </Stack>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </Stack>
  );
}
