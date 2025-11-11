'use client';

import { createContext, ReactNode, useContext, useState } from "react";
import UserTask from "@/public/icon/user-task.svg";;
import SendEmail from "@/public/icon/email-task.svg";
import SendHTTP from "@/public/icon/http-request-task.svg";
import Organization from "@/public/icon/organization-task.svg";
import Notification from "@/public/icon/notification-task.svg";
import Record from "@/public/icon/record-task.svg";
import GetRecord from "@/public/icon/get-record-task.svg";
import Loop from "@/public/icon/loop-task.svg";
import PhoneCall from "@/public/icon/phone-call-task.svg";

import Exclusive from "@/public/icon/exclusive-gateway.svg";
import Inclusive from "@/public/icon/inclusive-gateway.svg";
import Parallel from "@/public/icon/parallel-gateway.svg";

import Wait from "@/public/icon/wait-task.svg";
import Ends from "@/public/icon/end-event.svg";
import Start from "@/public/icon/start-event.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ComponentProps, IButtonGroup, IOptionSelect } from "@/app/(main)/types/consts";

export type NodeModel = {
    id: string,
    name: string,
    info: any,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    businessObject: any
}

export type TaskItemModel = {
    fn: string,
    type: string,
    label: string,
    key?: string,
    icon: StaticImport
}

export type GatewayItemModel = {
    fn: string,
    type: string,
    label: string,
    icon: StaticImport
}

export type EventItemModel = {
    fn: string,
    type: string,
    label: string,
    icon: StaticImport
    key?: string
}

export class ManagerBpmnContextType {
    data: NodeModel[] = []
    setData!: (value: NodeModel[]) => void
    taskItems: TaskItemModel[] = []
    gatewayItems: GatewayItemModel[] = []
    eventItems: EventItemModel[] = []
    dataField: ComponentProps[] = []
    setDataField!: (value: ComponentProps[]) => void
}

export const ManagerBpmnContext = createContext<ManagerBpmnContextType>(new ManagerBpmnContextType());

interface IProps {
    children: ReactNode
}

export const ManagerBpmnProvider = ({ children }: IProps) => {
    const [data, setData] = useState<NodeModel[]>([])
    const [dataField, setDataField] = useState<ComponentProps[]>([])

    const taskItems = [
        { fn: "startCreate", type: "bpmn:UserTask", label: "User Task", icon: UserTask },
        { fn: "startCreate", type: "bpmn:SendTask", label: "Send Email", icon: SendEmail },
        { fn: "addLoopTask", type: "elEx:HttpTask", label: "Send HTTP Request", key: "SEND_HTTP_TASK", icon: SendHTTP },
        { fn: "addLoopTask", type: "elEx:OrganizationTask", label: "Organization", key: "ORGANIZATION_TASK", icon: Organization },
        { fn: "addLoopTask", type: "elEx:SendNotificationTask", label: "Send Notification", key: "SEND_NOTIFICATION_TASK", icon: Notification },
        { fn: "addLoopTask", type: "elEx:CreateRecordTask", label: "Create and Update Record", key: "CREATE_RECORD_TASK", icon: Record },
        { fn: "addLoopTask", type: "elEx:GetRecordTask", label: "Get Record", key: "GET_RECORD_TASK", icon: GetRecord },
        { fn: "addLoopTask", type: "elEx:LoopTask", label: "Loop", key: "LOOP_TASK", icon: Loop },
        { fn: "startCreate", type: "bpmn:ServiceTask", label: "Phone Call", icon: PhoneCall },
    ];

    const gatewayItems = [
        { fn: "startCreate", type: "bpmn:ExclusiveGateway", label: "Exclusive gateway", icon: Exclusive },
        { fn: "startCreate", type: "bpmn:InclusiveGateway", label: "Inclusive gateway", icon: Inclusive },
        { fn: "startCreate", type: "bpmn:ParallelGateway", label: "Parallel gateway", icon: Parallel },
    ];

    const eventItems = [
        { fn: "addLoopTask", type: "elEx:WaitTask", label: "Wait", key: "WAIT_TASK", icon: Wait },
        { fn: "startCreate", type: "bpmn:EndEvent", label: "Ends", icon: Ends },
        // { fn: "startCreate", type: "bpmn:StartEvent", label: "Start", icon: Start },
    ];

    return (
        <ManagerBpmnContext.Provider value={{
            data,
            setData,
            taskItems,
            gatewayItems,
            eventItems,
            dataField,
            setDataField
        }}>
            {children}
        </ManagerBpmnContext.Provider>
    )
}

export const useManagerBpmnContext = () => {
    return useContext(ManagerBpmnContext)
}