import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';

import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';

import {
  ReactPlugin,
  ReactArea2D,
  Presets as ReactPresets,
} from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';

import { DataflowEngine, ControlFlowEngine } from "rete-engine";
import {
  ContextMenuPlugin,
  ContextMenuExtra,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';

// Custom Stuff
import { addCustomBackground } from '@/customization/custom-background';
import { GodotNode } from './custom/CustomNode';
import { GodotConnection } from './custom/CustomConn';
import { GodotSocket } from './custom/CustomSockets';

const socket = new Classic.Socket('socket');

// TODO: Create a Node Program that is Basically Math Lmao
class NumberNode extends Classic.Node<
  {},
  { value: Classic.Socket },
  { value: Classic.InputControl<"number"> }
> {
  width = 200;
  height = 150;

  constructor(initial: number, change?: (value: number) => void) {
    super('Number');

    this.addControl(
      'value',
      new Classic.InputControl('number', { initial, change })
    );
    this.addOutput('value', new Classic.Output(socket, 'Number'));
  }
  data(): { value: number } {
    return {
      value: this.controls.value.value || 0,
    }
  }


}


class AddNode extends Classic.Node<
  { left: Classic.Socket; right: Classic.Socket },
  { value: Classic.Socket },
  { value: Classic.InputControl<"number"> }
> {
  width = 200;
  height = 240;

  constructor(
    change?: () => void,
    private update?: (control: Classic.InputControl<"number">) => void
  ) {
    super("Add");
    const left = new Classic.Input(socket, "Left");
    const right = new Classic.Input(socket, "Right");

    left.addControl(
      new Classic.InputControl("number", { initial: 0, change })
    );
    right.addControl(
      new Classic.InputControl("number", { initial: 0, change })
    );

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl(
      "value",
      new Classic.InputControl("number", {
        readonly: true
      })
    );
    this.addOutput("value", new Classic.Output(socket, "Number"));
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left?.control as Classic.InputControl<
      "number"
    >;
    const rightControl = this.inputs.right
      ?.control as Classic.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) +
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

class SubtractNode extends Classic.Node<
{ left: Classic.Socket; right: Classic.Socket },
{ value: Classic.Socket },
{ value: Classic.InputControl<"number"> }
> {
  width = 200;
  height = 240;

  constructor(
    change?: () => void,
    private update?: (control: Classic.InputControl<"number">) => void
  ) {
    super ('Subtract');

    const left = new Classic.Input(socket, 'left');
    const right = new Classic.Input(socket, 'right');

    left.addControl(
      new Classic.InputControl('number', { initial: 0, readonly: true })
    )

    right.addControl(
      new Classic.InputControl('number', { initial: 0, readonly: true })
    )

    this.addInput('left', left);
    this.addInput('right', right);
    this.addControl(
      "value",
      new Classic.InputControl("number", {
        readonly: true
      })
    );
    this.addOutput(
      'value',
      new Classic.Output(socket, 'Number')
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left?.control as Classic.InputControl<
      "number"
    >;
    const rightControl = this.inputs.right
      ?.control as Classic.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) -
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

class MultiplyNode extends Classic.Node<
  { left: Classic.Socket; right: Classic.Socket },
  { value: Classic.Socket },
  { value: Classic.InputControl<"number"> }
> {
  width = 200;
  height = 240;

  constructor(
    change?: () => void,
    private update?: (control: Classic.InputControl<"number">) => void
  ) {
    super ('Multiply');

    const left = new Classic.Input(socket, 'left');
    const right = new Classic.Input(socket, 'right');

    left.addControl(
      new Classic.InputControl('number', { initial: 0, readonly: true })
    )

    right.addControl(
      new Classic.InputControl('number', { initial: 0, readonly: true })
    )

    this.addInput('left', left);
    this.addInput('right', right);
    this.addControl(
      "value",
      new Classic.InputControl("number", {
        readonly: true
      })
    );
    this.addOutput(
      'value',
      new Classic.Output(socket, 'Number')
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left?.control as Classic.InputControl<
      "number"
    >;
    const rightControl = this.inputs.right
      ?.control as Classic.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) *
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

class Connection<
  A extends Node,
  B extends Node
> extends Classic.Connection<A, B> {}




type Node = NumberNode | AddNode | SubtractNode | MultiplyNode;
type ConnProps = Connection<NumberNode, AddNode> | Connection<AddNode, AddNode> | Connection<NumberNode, SubtractNode> | Connection<NumberNode, MultiplyNode>;
type Schemes = GetSchemes<Node, ConnProps>;

type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;

export const createEditor = async (container: HTMLElement) => {
    const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });  
  const engine = new DataflowEngine<Schemes>();

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl(),
    });


    function process(){
      engine.reset();
  
      editor
        .getNodes()
        .forEach((n) => engine.fetch(n.id));
    }

    const contextMenu = new ContextMenuPlugin<Schemes>({
        items: ContextMenuPresets.classic.setup([
          ["Number Node", () => new NumberNode(0)],
          ["Add Node", () => new AddNode(process, (c) => area.update("control", c.id))],
          [ "Subtract Node", () => new SubtractNode(process, (c) => area.update("control", c.id)) ],
          [ "Multiply Node", () => new MultiplyNode(process, (c) => area.update("control", c.id)) ],
        ]),
    });

    connection.addPreset(ConnectionPresets.classic.setup());
    addCustomBackground(area);
    reactRender.addPreset(ReactPresets.classic.setup({
      customize: {
        node(context){
          // Force Use The Customized Node
          return GodotNode;
        },
        connection() {
          return GodotConnection;
        },
        socket() {
          return GodotSocket;
        },
      }
    }));
    reactRender.addPreset(ReactPresets.contextMenu.setup());

    editor.use(engine);
    editor.use(area);
    area.use(reactRender);
    area.use(connection);
    area.use(contextMenu);

    // Area Extensions
    AreaExtensions.simpleNodesOrder(area);
    AreaExtensions.showInputControl(area);

    // Event Checker
    editor.addPipe((context) => {
      if (["connectioncreated", "connectionremoved"].includes(context.type)) {
        console.log(context)
        process();
      }
      return context;
    });


    // // Add Numbernode and Place it properly
    // const numberNode = new NumberNode(0);
    // const addNode = new AddNode();

    // await editor.addNode(numberNode);
    // await editor.addNode(addNode);

    // await area.translate(numberNode.id, { x: 250, y: 0 });
    // await area.translate(addNode.id, { x: 500, y: 0 });

    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 10);

    return {
        destroy: () => area.destroy()
    }
}