import { Button, Grid, Heading, Section, Stack, Text } from "@gunkin/uiify";

const logos = ["Northwind", "Globex", "Initech", "Umbrella", "Hooli", "Vandelay"];

export default function LogoWall() {
  return (
    <Section paddingBlock="xl" container aria-labelledby="logos-title" className="w-full">
      <Stack gap="xl" align="center" className="mx-auto max-w-5xl">
        <Stack gap="sm" align="center">
          <Heading id="logos-title" level={2} size="3xl" align="center" wrap="balance">
            Trusted by 2,000 product teams
          </Heading>
          <Text tone="muted" align="center" measure="prose">
            From two-person startups to public companies, teams plan and ship with us.
          </Text>
        </Stack>
        <Grid
          as="ul"
          padding="none"
          columns={{ base: 2, md: 3, lg: 6 }}
          gap="lg"
          align="center"
          width="full"
        >
          {logos.map((name) => (
            <Stack as="li" key={name} align="center" paddingBlock="sm">
              <img src={`/logos/${name.toLowerCase()}.svg`} alt={name} width={120} height={32} />
            </Stack>
          ))}
        </Grid>
        <Stack direction="inline" gap="xs" align="center" justify="center" wrap>
          <Text size="sm" tone="muted">
            See how they cut release time in half.
          </Text>
          <Button href="/customers" variant="link" size="sm">
            Read customer stories
          </Button>
        </Stack>
      </Stack>
    </Section>
  );
}
