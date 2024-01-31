import { ClassicPreset } from "rete";
import styled from "styled-components";

// TODO: Create a Styled and Godot Inspired Socket

const Styles = styled.div`
  display: inline-block;
  cursor: pointer;
  border: 1px solid grey;
  width: 12px;
  height: 12px;
  vertical-align: middle;
  background: #61DAF4;
  z-index: 2;
  box-sizing: border-box;
  &:hover {
    background: #ddd;
  }
  border-radius:999px;
`;

export function GodotSocket<T extends ClassicPreset.Socket>(props: {
  data: T;
}) {
  return <Styles title={props.data.name} />;
}