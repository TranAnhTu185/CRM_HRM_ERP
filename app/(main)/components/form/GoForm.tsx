"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Box, Button, Drawer, Group, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { IconXboxX } from '@tabler/icons-react';
import Image from "next/image";

import UserTask from "@/public/icon/user-task.svg";
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
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import "./css/style.css";
import LoopForm from './content-form/loop-form';
import { childProps, GoFormProps, GoFormRef } from '@/app/(main)/types/consts';
import EmailForm from "@/app/(main)/components/form/content-form/email-form";
import NotificationForm from './content-form/notification-form';
import HttpRequestForm from './content-form/http-request-form';
import OrganizationForm from "@/app/(main)/components/form/content-form/organizationForm";
import ParallelgatewayForm from './content-form/ParallelGatewayForm';
import InclusiveGatewayForm from './content-form/InclusiveGatewayForm';
import ExclusiveGatewayForm from './content-form/ExclusiveGatewayForm';
import WaitForm from './content-form/wait-form';
import UserTaskForm from "@/app/(main)/components/form/content-form/user-task-form";
import GetRecordForm from './content-form/get-record-form';
import PhoneCallForm from './content-form/phone-call-form';
import CreateUpdateRecordForm from './content-form/create-update-form';

export const dynamic = "force-dynamic";


const GoForm = forwardRef<GoFormRef, GoFormProps>((props, ref) => {
    const { elementProp, onSubmit, data } = props;
    const [opened, setOpened] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [imgIcon, setImgIcon] = useState<StaticImport | string>("");
    const childRef = useRef<childProps>(null);

    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const maxLength = 255;
    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpened(true)
        }
    }));

    const initData = () => {
        if (data) {
            if ((elementProp?.type === "bpmn:EndEvent" || elementProp?.type === "bpmn:StartEvent")) {
                if (data.id === elementProp?.id) {
                    setValue(data.name);
                } else {
                    setValue("");
                }
            } else {
                setValue("");
            }
        } else {
            setValue("");
        }
    }

    useEffect(() => {
        getTitle(elementProp?.type);
        initData();
    }, [elementProp?.type, data])

    const getTitle = (type: string) => {
        switch (type) {
            case "bpmn:SendTask":
                setTitle("Send mail");
                setImgIcon(SendEmail);
                break;
            case "bpmn:UserTask":
                setTitle("Use task")
                setImgIcon(UserTask);
                break;
            case "bpmn:ExclusiveGateway":
                setTitle("Exclusive Gateway");
                setImgIcon(Exclusive);
                break;
            case "elEx:HttpTask":
                setImgIcon(SendHTTP);
                setTitle("Send HTTP Request");
                break;
            case "elEx:OrganizationTask":
                setImgIcon(Organization);
                setTitle("Origanzation")
                break;
            case "elEx:SendNotificationTask":
                setImgIcon(Notification);
                setTitle("Send Notification")
                break;
            case "elEx:CreateRecordTask":
                setImgIcon(Record);
                setTitle("Crate and Update Record");
                break;
            case "elEx:GetRecordTask":
                setImgIcon(GetRecord);
                setTitle("Get Record")
                break;
            case "elEx:LoopTask":
                setImgIcon(Loop);
                setTitle("Loop")
                break;
            case "bpmn:ServiceTask":
                setImgIcon(PhoneCall);
                setTitle("Phone Call");
                break;
            case "bpmn:InclusiveGateway":
                setImgIcon(Inclusive);
                setTitle("Inclusive gateway")
                break;
            case "bpmn:ParallelGateway":
                setImgIcon(Parallel);
                setTitle("Parallel Gateway")
                break;
            case "elEx:WaitTask":
                setImgIcon(Wait);
                setTitle("Wait")
                break;
            case "bpmn:EndEvent":
                setImgIcon(Ends);
                setTitle("Ends")
                break;
            default:
                setImgIcon(Start);
                setTitle("Start");
        }
    }

    const handleChildSubmit = (values: any) => {
        setOpened(false);
        onSubmit(values);
    };

    const handleSubmit = () => {
        if (elementProp?.type === "bpmn:EndEvent" || elementProp?.type === "bpmn:StartEvent") {
            let values = {};
            if (!value.trim()) {
                setError("Tên là bắt buộc");
            } else {
                if (value.length > maxLength) {
                    setError("Tên không dc quá " + maxLength + " ký tự")
                } else {
                    values["name"] = value;
                    handleChildSubmit(values);
                    setError(null);
                }
            }
        }
        childRef.current?.onSubmit();
    }
    return <>
        <Drawer className={'mantine-Drawer-prmu'} title={
            <Group gap="sm" wrap="nowrap">
                <Image
                    src={imgIcon}
                    alt=""
                    className="w-7 h-7 "
                />
                <div>
                    <Text c="dark" fw={700} fz="lg">{title}</Text>
                </div>
            </Group>
        } size={'55%'} opened={opened} position={'right'} onClose={() => {
            setOpened(false)
        }}
            closeButtonProps={{
                icon: <IconXboxX size={40} stroke={2} style={{ color: "#000000ff" }} />,
            }}
        >

            <div className="bg-white rounded-2xl contents justify-center  px-6 pb-6 w-full max-w-md relative">

                {(elementProp?.type === "bpmn:EndEvent" || elementProp?.type === "bpmn:StartEvent")
                    &&
                    <TextInput
                        label={
                            <span className='text-black'>
                                Tên
                            </span>
                        }
                        placeholder="Nhập tên..."
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                        maxLength={maxLength}
                        // ✅ Thêm counter bên phải input
                        rightSection={
                            <Text size="xs" c="dimmed">
                                {value.length}/{maxLength}
                            </Text>
                        }
                        required
                        error={error}
                        rightSectionWidth={65}
                        styles={{
                            input: {
                                backgroundColor: "#fafbff", // màu giống ảnh
                                paddingRight: 60,
                            },
                        }}
                    />}


                <div className={'h-[85vh] overflow-y-auto hidden-scroll'}>
                    {elementProp?.type === "elEx:LoopTask" && <LoopForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "bpmn:SendTask" && <EmailForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "elEx:SendNotificationTask" && <NotificationForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "elEx:HttpTask" && <HttpRequestForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "elEx:OrganizationTask" && <OrganizationForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "bpmn:ParallelGateway" && <ParallelgatewayForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "bpmn:InclusiveGateway" && <InclusiveGatewayForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "bpmn:ExclusiveGateway" && <ExclusiveGatewayForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "elEx:WaitTask" && <WaitForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "bpmn:UserTask" && <UserTaskForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "elEx:GetRecordTask" && <GetRecordForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "bpmn:ServiceTask" && <PhoneCallForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                    {elementProp?.type === "elEx:CreateRecordTask" && <CreateUpdateRecordForm dataItem={data} ref={childRef} onSubmit={handleChildSubmit} />}
                </div>
                <Box
                    pos="fixed"
                    bottom={0}
                    left={0}
                    right={0}
                    style={{
                        borderTop: "1px solid var(--mantine-color-gray-3)",
                        background: "white",
                        padding: "12px 16px",
                    }}
                >
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => {
                            setOpened(false);
                        }}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit}>Hoàn thành</Button>
                    </Group>
                </Box>

            </div>
        </Drawer>
    </>
});

GoForm.displayName = 'GoPremium';

export default GoForm