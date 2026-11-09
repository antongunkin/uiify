"use client";

import { useRef, useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  Badge,
  Box,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Heading,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function AlertConfirmation() {
  const [deleted, setDeleted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <Box maxWidth="md" className="mx-auto w-full">
      <Card as="section" aria-labelledby="draft-title">
        <CardHeader>
          <CardTitle as="h2" id="draft-title" ref={heading} tabIndex={-1}>
            Draft
          </CardTitle>
          <CardDescription>Q4 launch announcement · edited 2 hours ago</CardDescription>
          <CardAction>
            <Badge variant="secondary">Unpublished</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Text tone="muted">
            {deleted
              ? "Nothing here now. Start a new draft from the editor."
              : "Release 2.4 brings faster search, release notes and a new billing page."}
          </Text>
        </CardContent>
        <CardFooter>
          {deleted ? (
            <Text role="status" size="sm">
              Draft removed from this demo.
            </Text>
          ) : (
            <>
              <AlertDialogTrigger target="delete-draft">Delete draft</AlertDialogTrigger>
              <AlertDialogContent
                id="delete-draft"
                aria-labelledby="delete-draft-title"
                aria-describedby="delete-draft-description"
              >
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Heading id="delete-draft-title" level={3} size="lg">
                      Delete draft?
                    </Heading>
                    <Text id="delete-draft-description" tone="muted">
                      This removes the draft from this demo. You cannot undo it.
                    </Text>
                  </Stack>
                  <Stack direction="inline" gap="sm" justify="end" wrap>
                    <AlertDialogCancel target="delete-draft">Keep draft</AlertDialogCancel>
                    <AlertDialogAction
                      target="delete-draft"
                      onClick={() => {
                        setDeleted(true);
                        requestAnimationFrame(() => heading.current?.focus());
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </Stack>
                </Stack>
              </AlertDialogContent>
            </>
          )}
        </CardFooter>
      </Card>
    </Box>
  );
}
