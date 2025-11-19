"use client";

import { forwardRef, use, useEffect, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    TagsInput,
    FileInput,
    Title,
    Group,
    Button,
    ActionIcon, Popover, Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/(main)/types/consts";
import { Link, RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import { IconFileZip, IconTrash } from "@tabler/icons-react";
import { useListState } from "@mantine/hooks";
import { ComboSelect } from "../../base/comboboxSelect";

export const dynamic = "force-dynamic";

const EmailForm = forwardRef<childProps, ChildFormProps>(({ dataItem, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const [showCc, handelersetShowCc] = useListState<string[]>(dataItem?.info?.cc);
    const [showBcc, handlersetShowBcc] = useListState<string[]>(dataItem?.info?.bcc);
    const [showReplyTo, handlersetShowReplyTo] = useListState<string[]>(dataItem?.info?.replyTo);

    const icon = <IconFileZip size={18} stroke={1.5} />;
    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            console.log(form.values);
            const { hasErrors } = form.validate();
            if (!hasErrors) {
                const data = { ...form.values, cc: showCc, bcc: showBcc, replyTo: showReplyTo };
                onSubmit(data);
            }
        },
    }));

    const initData = () => {
        if (dataItem && dataItem.info) {
            form.setValues({
                name: dataItem.info.name,
                emailSubject: dataItem.info.emailSubject,
                to: dataItem.info.to,
                cc: dataItem.info.cc,
                bcc: dataItem.info.bcc,
                replyTo: dataItem.info.replyTo,
                textType: dataItem.info.textType,
                emailContent: dataItem.info.emailContent,
                title: dataItem.info.title,
                body: dataItem.info.body,
                file: dataItem.info.file,
                description: dataItem.info.description,
                from: dataItem.info.from,
            });
        }
    }

    useEffect(() => {
        initData();
    }, [dataItem])


    const form = useForm({
        initialValues: {
            name: "",
            emailSubject: "",
            to: [],
            cc: [],
            bcc: [],
            replyTo: [],
            textType: "1",
            emailContent: "1",
            title: "",
            body: "",
            file: "",
            description: "",
            from: "",

        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            from: (value) =>
                value.trim().length < 1 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            // k thay sd field nay gay loi k submit form duoc
            // emailSubject: (value) =>
            //     value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            textType: (value) =>
                value.trim().length < 1 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            emailContent: (value) =>
                value.trim().length < 1 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        immediatelyRender: false,
        onUpdate({ editor }) {
            form.setFieldValue('body', editor.getHTML());
        },
        content: form.values.body, // Initialize editor with form value
    });

    const addCC = () => {
        handelersetShowCc.append([]);
    };

    const addBCC = () => {
        handlersetShowBcc.append([]);
    };
    const addReplyTo = () => {
        handlersetShowReplyTo.append([]);
    };

    const filteredOptions2 = [
        { value: "var1", label: "Biến 1" },
        { value: "var2", label: "Biến 2" },
        { value: "var3", label: "Biến 3" },
    ]
    return (
        <Box mx="auto">
            <form>
                {/* Tên */}
                <TextInput
                    label={
                        <span className="text-black">
                            Tên
                        </span>
                    }
                    placeholder="Nhập tên..."
                    {...form.getInputProps("name")}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            {form.values.name.length}/{maxNameLength}
                        </Text>
                    }
                    rightSectionWidth={70}
                    maxLength={maxDescLength}
                    withAsterisk
                    mb="md"
                />
                {/*Description*/}
                <Textarea
                    label="Mô tả"
                    rows={3}
                    placeholder="Nhập mô tả..."
                    mt="sm"
                    {...form.getInputProps('description')}
                />
                <Divider my="sm" />
                <span className={'font-bold'}>Thiết lập Email</span>

                <Title order={3} mb="md">
                    Cấu hình Email
                </Title>

                {/* Các link toggle */}
                <Group gap="lg" mb="sm">
                    <Button variant="subtle" size="xs" onClick={addCC}>
                        Cc
                    </Button>
                    <Button variant="subtle" size="xs" onClick={addBCC}>
                        Bcc
                    </Button>
                    <Button variant="subtle" size="xs" onClick={addReplyTo}>
                        Reply-to
                    </Button>
                </Group>
                {/*Người gửi*/}
                {/*<Popover>*/}
                {/*    <Popover.Target>*/}
                {/*        <TextInput*/}
                {/*            flex={1}*/}
                {/*            mt={'sm'}*/}
                {/*            label="Người gửi"*/}
                {/*            placeholder="Chọn người gửi"*/}
                {/*            value={*/}
                {/*                [   { value: "1", label: 'Ông A' },*/}
                {/*                    { value: "2", label: 'Bà B' },*/}
                {/*                ].find((o) => o.value === form.getValues().from)?.label ??""*/}
                {/*            }*/}
                {/*            // onClick={(e) => {*/}
                {/*            //     const target = (e?.currentTarget as HTMLElement)?.closest<HTMLElement>("[data-popover-target]");*/}
                {/*            //     if (target) (target as HTMLElement).click();*/}

                {/*            // }}*/}
                {/*            readOnly*/}
                {/*        />*/}
                {/*    </Popover.Target>*/}
                {/*    <Popover.Dropdown>*/}
                {/*        <Stack gap="xs">*/}
                {/*            {[*/}
                {/*                { value: "1", label: 'Ông A' },*/}
                {/*                { value: "2", label: 'Bà B' },*/}
                {/*            ].map((option) => (*/}
                {/*                <Button*/}
                {/*                    key={option.value}*/}
                {/*                    variant={option.value === form.getValues().from? "light" : "transparent"}*/}
                {/*                    fullWidth*/}
                {/*                    onClick={() => {*/}


                {/*                        form.setFieldValue('from', option.value)*/}

                {/*                        // updateCondition(groupIndex, condIndex, "type", option.value || "")*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    {option.label}*/}
                {/*                </Button>*/}
                {/*            ))}*/}
                {/*        </Stack>*/}
                {/*    </Popover.Dropdown>*/}
                {/*</Popover>*/}


                {/* <Select
                    required
                    label="Người gửi"
                    placeholder="Chọn người gửi..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'Ông A' },
                        { value: "2", label: 'Bà B' },
                    ]}
                    {...form.getInputProps('from')}
                    withAsterisk
                /> */}

                <ComboSelect
                    label="Người gửi"
                    placeholder="Chọn người gửi..."
                    data={[
                        { value: "1", label: 'Ông A' },
                        { value: "2", label: 'Bà B' },
                    ]}
                    value={form.values.from}
                    onChange={(opt) => {
                        form.setFieldValue('from', opt.value)
                    }}
                />


                {/*Người nhận*/}
                <TagsInput
                    required
                    label="To"
                    placeholder="Nhập email người nhận..."
                    maxTags={3}
                    defaultValue={[]}
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('to')} />
                {/*cc*/}
                {showCc && showCc.length > 0 && <Title mt="sm" order={5}>CC</Title>}
                {showCc.map((value, index) => (
                    <Group key={index} mb="sm" grow align="center" className="flex items-center ius" preventGrowOverflow={false} wrap="nowrap">
                        <TagsInput
                            placeholder="Cc..."
                            maxTags={3}
                            value={value || []}
                            mt="sm"
                            flex={1}
                            onChange={(val) => handelersetShowCc.setItem(index, val)} />
                        <ActionIcon
                            color="red"
                            variant="subtle"
                            className="!max-w-[28px]"
                            onClick={() => handelersetShowCc.remove(index)}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                ))}
                {showBcc && showBcc.length > 0 && <Title mt="sm" order={5}>BCC</Title>}
                {showBcc.map((value, index) => (
                    <Group key={index} mb="sm" grow align="center" className="flex items-center ius" preventGrowOverflow={false} wrap="nowrap">
                        <TagsInput
                            placeholder="Bcc..."
                            maxTags={3}
                            defaultValue={value || []}
                            mt="sm"
                            flex={1}
                            onChange={(val) => handlersetShowBcc.setItem(index, val)} />
                        <ActionIcon
                            color="red"
                            variant="subtle"
                            className="!max-w-[28px]"
                            onClick={() => handlersetShowBcc.remove(index)}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                ))}
                {showReplyTo && showReplyTo.length > 0 && <Title mt="sm" order={5}>Reply-To</Title>}
                {showReplyTo.map((value, index) => (
                    <Group key={index} mb="sm" grow align="center" className="flex items-center ius" preventGrowOverflow={false} wrap="nowrap">
                        <TagsInput
                            label="Reply-to"
                            placeholder="ReplyTo..."
                            maxTags={3}
                            defaultValue={value || []}
                            mt="sm"
                            flex={1}
                            onChange={(val) => handlersetShowReplyTo.setItem(index, val)} />
                        <ActionIcon
                            color="red"
                            variant="subtle"
                            className="!max-w-[28px]"
                            onClick={() => handlersetShowReplyTo.remove(index)}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                ))}
                {/*Tiêu đề email*/}
                <TextInput
                    required
                    label="Tiêu đề email"
                    placeholder="Nhập..."
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('title')}
                />

                {/*loại văn bản*/}
                <Select
                    required
                    label="Loại văn bản"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'Văn bản có định dạng' },
                        { value: "2", label: 'Văn bản thuần' },
                    ]}
                    {...form.getInputProps('textType')}
                />

                {/*Nội dung email*/}
                {/*<Select*/}
                {/*    required*/}
                {/*    label="Nội dung email"*/}
                {/*    placeholder="Chọn..."*/}
                {/*    mt="sm"*/}
                {/*    withAsterisk*/}
                {/*    data={[*/}
                {/*        { value: "1", label: 'Nhập nội dung thủ công' },*/}
                {/*        { value: "2", label: 'Sử dụng mẫu văn bản' },*/}
                {/*        { value: "3", label: 'Sử dụng tài nguyên hoặc biến khác' },*/}
                {/*    ]}*/}
                {/*    {...form.getInputProps('emailContent')}*/}
                {/*/>*/}

                <Popover
                    position="bottom-start"

                >
                    <Popover.Target>
                        <TextInput
                            flex={1}
                            mt={'sm'}
                            label="Người gửi"

                            placeholder="Chọn người gửi"
                            value={
                                [{ value: "1", label: 'Nhập nội dung thủ công' },
                                { value: "2", label: 'Sử dụng mẫu văn bản' },
                                { value: "3", label: 'Sử dụng tài nguyên hoặc biến khác' },
                                ].find((o) => o.value === form.getValues().emailContent)?.label ?? ""
                            }
                            // onClick={(e) => {
                            //     const target = (e?.currentTarget as HTMLElement)?.closest<HTMLElement>("[data-popover-target]");
                            //     if (target) (target as HTMLElement).click();

                            // }}

                            readOnly
                        />
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Stack gap="xs">
                            {[
                                { value: "1", label: 'Nhập nội dung thủ công' },
                                { value: "2", label: 'Sử dụng mẫu văn bản' },
                                { value: "3", label: 'Sử dụng tài nguyên hoặc biến khác' },
                            ].map((option) => (
                                <Button

                                    key={option.value}
                                    variant={option.value === form.getValues().from ? "light" : "transparent"}
                                    fullWidth
                                    onClick={() => {


                                        form.setFieldValue('emailContent', option.value)

                                        // updateCondition(groupIndex, condIndex, "type", option.value || "")
                                    }}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </Stack>
                    </Popover.Dropdown>
                </Popover>





                {form.values.emailContent === "1" && <RichTextEditor mt="sm" {...form.getInputProps('body')} editor={editor}
                    styles={{
                        content: {
                            minHeight: 200,   // Chiều cao ban đầu (px)
                        },
                    }}
                >
                    <RichTextEditor.Toolbar>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>
                }

                {/*file*/}
                <FileInput
                    leftSection={icon}
                    label="Tệp đính kèm"
                    placeholder="Chọn tệp đính kèm"
                    leftSectionPointerEvents="none"
                    {...form.getInputProps('file')}
                    mt="sm"
                />

            </form>
        </Box>
    );
});


EmailForm.displayName = "EmailForm";
export default EmailForm;
