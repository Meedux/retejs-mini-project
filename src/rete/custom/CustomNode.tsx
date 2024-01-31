import { ClassicScheme, RenderEmit, Presets } from "rete-react-plugin";
import styled, { css } from "styled-components";
const { RefSocket, RefControl } = Presets.classic;
import { $nodewidth, $socketmargin, $socketsize } from "./../../customization/vars";

// TODO: Create a Styled and Godot Inspired Node

export const NodeStyles = styled.div<
  NodeExtraData & { selected: boolean; styles?: (props: any) => any }
>`
  background: #0B0D12;
  border: 2px solid grey;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  box-sizing: border-box;
  width: ${(props) =>
    Number.isFinite(props.width) ? `${props.width}px` : `${$nodewidth}px`};
  height: ${(props) =>
    Number.isFinite(props.height) ? `${props.height}px` : "auto"};
  padding-bottom: 6px;
  position: relative;
  user-select: none;
  &:hover {
    background: #333;
  }
  ${(props) =>
    props.selected &&
    css`
      border-color: red;
    `}
  .title {
    color: white;
    font-family: sans-serif;
    font-size: 18px;
    padding: 8px;
  }
  .output {
    text-align: right;
  }
  .input {
    text-align: left;
  }
  .output-socket {
    text-align: right;
    margin-right: -1px;
    display: inline-block;
  }
  .input-socket {
    text-align: left;
    margin-left: -1px;
    display: inline-block;
  }
  .input-title,
  .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: ${$socketmargin}px;
    line-height: ${$socketsize}px;
  }
  .input-control {
    z-index: 1;
    width: calc(100% - ${$socketsize + 2 * $socketmargin}px);
    vertical-align: middle;
    display: inline-block;

    color: black;
  }
  .control {
    display: block;
    padding: ${$socketmargin}px ${$socketsize / 2 + $socketmargin}px;
  }
  ${(props) => props.styles && props.styles(props)}
`;

function sortByIndex<T extends [string, undefined | { index?: number }][]>(
    entries: T
  ) {
    entries.sort((a, b) => {
      const ai = a[1]?.index || 0;
      const bi = b[1]?.index || 0;
  
      return ai - bi;
    });
}

type NodeExtraData = { width?: number; height?: number };
  
type Props<S extends ClassicScheme> = {
    data: S["Node"] & NodeExtraData;
    styles?: () => any;
    emit: RenderEmit<S>;
};
export type NodeComponent<Scheme extends ClassicScheme> = (
    props: Props<Scheme>
) => JSX.Element;

export function GodotNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
    const inputs = Object.entries(props.data.inputs);
    const outputs = Object.entries(props.data.outputs);
    const controls = Object.entries(props.data.controls);
    const selected = props.data.selected || false;
    const { id, label, width, height } = props.data;

    sortByIndex(inputs);
    sortByIndex(outputs);
    sortByIndex(controls);

    return (
        // use Tailwindcss to style the node and its components
        <NodeStyles
            selected={selected}
            width={width}
            height={height}
            styles={props.styles}
            data-testid="node"
        >
            <div className="font-bold text-xl text-white">{label}</div>
            {/* Outputs */}
            {outputs.map(
                ([key, output]) =>
                output && (
                    <div className="output" key={key}>
                        <div className="font-bold text-md text-white">{output?.label}</div>
                        <RefSocket
                            name="output-socket"
                            side="output"
                            emit={props.emit}
                            socketKey={key}
                            nodeId={id}
                            payload={output.socket}
                        />
                    </div>
                )
            )}
            {/* Inputs */}
            {inputs.map(
                ([key, input]) =>
                input && (
                    <div className="input flex flex-row mb-3" key={key}>
                        <RefSocket
                            name="input-socket"
                            side="input"
                            emit={props.emit}
                            socketKey={key}
                            nodeId={id}
                            payload={input.socket}
                        />
                        <div className="font-bold text-md text-white ml-3">{input?.label}</div>
                    </div>
                )
            )}
            {/* Controls */}
            {controls.map(([key, control]) => {
                return control ? (
                    <div className="mt-5">
                      <RefControl
                          key={key}
                          name="input-control"
                          emit={props.emit}
                          payload={control}
                          data-testid="input-control"
                      />
                    </div>
                ) : null;
            })}
        </NodeStyles>
    );
}
  