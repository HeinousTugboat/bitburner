import Button from "@mui/material/Button";
import React from "react";

import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { use } from "../../ui/Context";
import { BlackOperation } from "../BlackOperation";
import type { IBladeburner } from "../IBladeburner";

interface IProps {
  bladeburner: IBladeburner;
  type: number;
  name: string;
  rerender: () => void;
}
export function StartButton(props: IProps): React.ReactElement {
  const player = use.Player();
  const action = props.bladeburner.getActionObject({ name: props.name, type: props.type });
  if (action == null) {
    throw new Error("Failed to get Operation Object for: " + props.name);
  }
  let disabled = false;
  if (action.count < 1) {
    disabled = true;
  }
  if (props.name === "Raid" && props.bladeburner.getCurrentCity().comms === 0) {
    disabled = true;
  }

  if (action instanceof BlackOperation && props.bladeburner.rank < action.reqdRank) {
    disabled = true;
  }
  function onStart(): void {
    if (disabled) return;
    props.bladeburner.action.type = props.type;
    props.bladeburner.action.name = props.name;
    if (!player.hasAugmentation(AugmentationNames.BladesSimulacrum, true)) player.singularityStopWork();
    props.bladeburner.startAction(player, props.bladeburner.action);
    props.rerender();
  }

  return (
    <Button sx={{ mx: 1 }} disabled={disabled} onClick={onStart}>
      Start
    </Button>
  );
}
