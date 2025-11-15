import * as React from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@repo/ui/item";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/ui/empty";

interface ProgressItemGroupProps {
  data: ProgressItemProps[];
  emptyStateTitle: string;
  emptyStateDescription: string;
}

export function ProgressItemGroup({ data, emptyStateTitle, emptyStateDescription }: ProgressItemGroupProps) {
  return (
    <ItemGroup>
      {data.length > 0 && data.map((item, index) => (
        <ProgressItem
          key={index}
          primaryText={item.primaryText}
          secondaryText={item.secondaryText}
          tertiaryText={item.tertiaryText}
        />
      ))}
      {data.length === 0 && (
        <Empty className="p-2 md:p-2">
          <EmptyHeader>
            <EmptyTitle>{emptyStateTitle}</EmptyTitle>
            <EmptyDescription>
              {emptyStateDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </ItemGroup>
  );
}
interface ProgressItemProps {
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
}

export function ProgressItem({ primaryText, secondaryText, tertiaryText }: ProgressItemProps) {
  return (
    <Item variant="outline" className="my-2">
      <ItemContent>
        <ItemTitle className="text-lg font-bold">{primaryText}</ItemTitle>
        <ItemDescription className="text-md text-muted-foreground">{secondaryText}</ItemDescription>
        <ItemDescription className="text-sm text-muted-foreground">{tertiaryText}</ItemDescription>
      </ItemContent>
    </Item>
  );
}