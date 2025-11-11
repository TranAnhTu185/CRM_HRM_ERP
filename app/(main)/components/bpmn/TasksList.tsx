'use client';

import BpmnJS from 'bpmn-js/lib/Modeler';
import Image from "next/image";
import UserTask from "@/public/icon/user-task.svg";
import { NodeModel, useManagerBpmnContext } from '@/app/(main)/libs/contexts/manager-bpmn-context';
export default function BpmnSidebar({ modeler }: { modeler: BpmnJS | null }) {
  const { data, setData, taskItems, gatewayItems, eventItems } = useManagerBpmnContext()

  if (!modeler) {
    return <div className="w-64 p-3 border-r h-screen">Đang tải...</div>;
  }

  const elementFactory = modeler.get('elementFactory');
  const create = modeler.get('create');
  const eventBus = modeler.get("eventBus");

  // tạo shape như cũ
  function startCreate(event: React.MouseEvent, type: string, label: string) {
    const shape = elementFactory.createShape({
      type,
      width: 62,
      height: 62
    });
    if (label) {
      shape.businessObject.name = label;
    }

    create.start(event as any, shape);
  }

  modeler.get("eventBus").on('create.end', (e: any) => {
    const createdShape = e.context.shape;
    if (!createdShape || !createdShape.id) return;
  });


  // Tạo node custom`

  const addLoopTask = (event: React.MouseEvent, type: string, label: string, key: string) => {
    if (!modeler) return;

    const elementFactory = modeler.get('elementFactory');
    const moddle = modeler.get('moddle');

    // Tạo shape
    const taskShape = elementFactory.createShape({
      type,              // ví dụ 'bpmn:UserTask'
      width: 62,
      height: 62
    });

    // ✅ set label sau khi tạo
    if (label) {
      taskShape.businessObject.name = label;
    }

    // Tạo extensionElements nếu chưa có
    if (!taskShape.businessObject.extensionElements) {
      taskShape.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements', { values: [] });
    }

    // Tạo elementInfo
    const elementInfo = moddle.create('configEx:elementInfo', { renderKey: key });
    taskShape.businessObject.elementInfo = elementInfo;


    create.start(event as unknown as any, taskShape);
    // Thêm vào canvas
    // modeling.createShape(taskShape, { x: 200, y: 150 }, elementRegistry.get('BlankProcess'));
  };


  const handleExport = async () => {
    if (!modeler) return;

    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');

    elementRegistry.filter((el: any) => el.type === 'bpmn:SequenceFlow').forEach((flow: any) => {
      if (!flow.source || !flow.target) {
        modeling.removeElements([flow]);
      }
    });

    try {
      const { xml } = await modeler.saveXML({ format: true });
      console.log(data);
      console.log('Exported BPMN XML:', xml);
      const obj = {
        content: data,
        xmlString: xml,
      }
      const url = "https://workflow.bytebuffer.co/workflow"
      try {
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
                "data": obj
            })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const dataOpen = await response.json();
        console.log(dataOpen);
      } catch (error) {
        console.error('Error during fetch:', error);
        throw error; // Re-throw the error for further handling
      }
    } catch (err) {
      console.error('Error exporting XML:', err);
    }
  };

  return (
    <div className="w-[320px] h-full overflow-y-auto py-4 rounded border border-gray-200 text-black mr-4">
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom"
        onClick={handleExport}
      >
        <Image
          src={UserTask}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary text-sm'>Save</span>
      </button>
      <h4 className="font-bold px-4 py-2 mb-2">Tasks</h4>
      {taskItems.map((item, idx) => (
        <button
          key={idx}
          className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
          onClick={(e) =>
            item.fn === "startCreate"
              ? startCreate(e, item.type, item.label)
              : addLoopTask(e, item.type, item.label, item.key!)
          }
        >
          <Image src={item.icon} alt={item.label} className="w-7 h-7" />
          <span className="prose-body2 text-typo-primary text-sm">{item.label}</span>
        </button>
      ))}

      <h4 className="font-bold px-4 py-2 mb-2">Gateways</h4>
      {gatewayItems.map((item, idx) => (
        <button
          key={idx}
          className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
          onClick={(e) => startCreate(e, item.type, item.label)}
        >
          <Image src={item.icon} alt={item.label} className="w-7 h-7" />
          <span className="prose-body2 text-typo-primary text-sm">{item.label}</span>
        </button>
      ))}

      <h4 className="font-bold px-4 py-2 mb-2">Events</h4>
      {eventItems.map((item, idx) => (
        <button
          key={idx}
          className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
          onClick={(e) =>
            item.fn === "startCreate"
              ? startCreate(e, item.type, item.label)
              : addLoopTask(e, item.type, item.label, item.key!)
          }
        >
          <Image src={item.icon} alt={item.label} className="w-7 h-7" />
          <span className="prose-body2 text-typo-primary text-sm">{item.label}</span>
        </button>
      ))}

    </div>
  );
}
