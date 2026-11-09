import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Field,
  Grid,
  RadioGroup,
  RadioGroupItem,
  Stack,
  Text,
} from "@gunkin/uiify";

const trims = [
  ["base", "Base", "$32,400", "Cloth seats, 8-inch screen"],
  ["sport", "Sport", "$36,900", "19-inch wheels, sport seats"],
  ["touring", "Touring", "$39,800", "Leather, panoramic roof"],
];
const colors = [
  ["white", "White", "Included"],
  ["graphite", "Graphite", "Included"],
  ["blue", "Deep blue", "+$600"],
];

export default function CarTrimBuilder() {
  return (
    <Grid
      as="form"
      action="/build"
      method="post"
      columns={{ base: 1, md: "3:2" }}
      gap="lg"
      align="start"
      responsive="viewport"
      className="mx-auto w-full max-w-6xl"
    >
      <Stack gap="lg">
        <AspectRatio ratio={16 / 9}>
          <img
            src="/cars/sport-graphite.jpg"
            alt="Sport trim in graphite"
            width={960}
            height={540}
          />
        </AspectRatio>
        <FieldSet>
          <FieldLegend>Color</FieldLegend>
          <RadioGroup aria-label="Color" orientation="horizontal">
            {colors.map(([value, title, price]) => (
              <Field key={value} orientation="horizontal">
                <RadioGroupItem
                  name="color"
                  value={value}
                  id={`color-${value}`}
                  defaultChecked={value === "graphite"}
                />
                <FieldLabel htmlFor={`color-${value}`}>
                  {title} · {price}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
      </Stack>
      <Card>
        <CardHeader>
          <CardDescription>2027 Aria hybrid</CardDescription>
          <CardTitle as="h1">Build your Aria</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldLegend>Trim</FieldLegend>
            <RadioGroup aria-label="Trim">
              {trims.map(([value, title, price, description]) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem
                    name="trim"
                    value={value}
                    id={`trim-${value}`}
                    defaultChecked={value === "sport"}
                  />
                  <FieldLabel htmlFor={`trim-${value}`}>
                    {title} · {price} · {description}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="between" align="center" width="full">
            <Text size="xl" weight="semibold">
              $36,900
            </Text>
            <Button type="submit">Review build</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Grid>
  );
}
