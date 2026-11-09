"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Field,
  FieldLabel,
  Heading,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@gunkin/uiify";

const people = [
  { name: "Ada Lovelace", role: "Owner", team: "Research" },
  { name: "Grace Hopper", role: "Admin", team: "Compilers" },
  { name: "Katherine Johnson", role: "Member", team: "Flight" },
];

export default function TableControls() {
  const [query, setQuery] = useState("");
  const visible = people.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Stack gap="md" className="mx-auto w-full max-w-3xl">
      <Stack direction="inline" justify="between" align="end" gap="md" wrap>
        <Stack gap="xs">
          <Heading level={2} size="2xl">
            People
          </Heading>
          <Text tone="muted">
            {visible.length} of {people.length} members shown
          </Text>
        </Stack>
        <Box grow={1} maxWidth="sm">
          <Field>
            <FieldLabel htmlFor="people-filter">Filter people</FieldLabel>
            <Input
              id="people-filter"
              type="search"
              placeholder="Type a name"
              value={query}
              onValueChange={setQuery}
            />
          </Field>
        </Box>
      </Stack>
      <Table aria-label="People" variant="outline">
        <TableHeader>
          <TableRow id="header">
            <TableHead id="name-heading">Name</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((person) => (
            <TableRow id={person.name.toLowerCase().replace(" ", "-")} key={person.name}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.team}</TableCell>
              <TableCell>
                <Badge variant={person.role === "Owner" ? "default" : "outline"}>
                  {person.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
