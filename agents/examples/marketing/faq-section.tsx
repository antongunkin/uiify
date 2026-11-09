import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Grid,
  Heading,
  Section,
  Stack,
  Text,
} from "@gunkin/uiify";

const questions = [
  ["Can I cancel any time?", "Yes. Your plan stays active until the end of the billing period."],
  ["Do you offer discounts?", "Nonprofits and schools get 50% off. Write to sales@example.com."],
  ["Where is my data stored?", "In the EU or the US, you choose when you create the workspace."],
  ["Can I get a refund?", "Within 14 days of your first payment, in full, to the same card."],
];

export default function FaqSection() {
  return (
    <Section paddingBlock="xl" container aria-labelledby="faq-title" className="w-full">
      <Grid columns={{ base: 1, md: "1:2" }} gap="xl" className="mx-auto max-w-5xl">
        <Stack gap="sm" align="start">
          <Heading id="faq-title" level={2} size="3xl">
            Questions, answered
          </Heading>
          <Text tone="muted">Everything about plans, billing and data.</Text>
          <Button href="/support" variant="outline">
            Contact support
          </Button>
        </Stack>
        <Accordion>
          {questions.map(([question, answer], index) => (
            <AccordionItem key={question} value={`faq-${index}`} name="faq">
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Grid>
    </Section>
  );
}
