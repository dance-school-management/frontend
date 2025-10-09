import * as React from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@repo/ui/item";

export function ProgressItemGroup({ data }: { data: ProgressItemProps[]; }) {
  return (
    <ItemGroup>
      {data.map((item, index) => (
        <ProgressItem
          key={index}
          primaryText={item.primaryText}
          secondaryText={item.secondaryText}
          tertiaryText={item.tertiaryText}
        />
      ))}
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