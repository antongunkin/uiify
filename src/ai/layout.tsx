import type { ComponentType } from "react";
import { Box, Grid, GridItem, Section, Stack } from "../components/layout/index.js";
import { Heading, Text } from "../components/typography/index.js";
import type { LayoutPart } from "../core/layout/index.js";

// AI documents project the public layout components directly. They use the same active layout
// stylesheet as component consumers; there is no AI-specific marker or stylesheet protocol.
export { Box, Grid, GridItem, Section, Stack, Heading, Text };

// oxlint-disable-next-line typescript/no-explicit-any -- each validated node has its own props
export const layoutComponents: Readonly<Record<LayoutPart, ComponentType<any>>> = {
  Box,
  Grid,
  GridItem,
  Section,
  Stack,
  Heading,
  Text,
};
