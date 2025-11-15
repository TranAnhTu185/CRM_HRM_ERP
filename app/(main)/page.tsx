"use client";

import { Button, Flex, Group, Modal, Paper, ScrollArea, Select, Stack, Table, Text, Textarea, TextInput, ThemeIcon } from "@mantine/core";
import { IconBolt, IconCalendar, IconCheck, IconDeviceDesktop, IconPencil, IconPlaylist, IconSearch, IconSettings, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import cx from 'clsx';
import classes from './page.module.css';
import { useRouter } from "next/navigation";
import { FlowOption, FlowType, Permission } from "./types/consts";

export const dynamic = "force-dynamic";

const flowOptions: FlowOption[] = [
    {
        type: "manual",
        title: "Manual Flow - Quy trình thông thường",
        description:
            "Cho phép người dùng thực hiện từng bước bằng cách nhập dữ liệu vào các màn hình đã cấu hình sẵn, sau đó chuyển tiếp các bước khác theo thiết lập.",
        icon: <IconDeviceDesktop size={28} />,
        color: "blue",
    },
    {
        type: "scheduled",
        title: "Scheduled Flow - Quy trình tự động theo thời gian",
        description:
            "Khởi chạy theo lịch trình và tần suất được thiết lập trước, đảm bảo quy trình diễn ra đúng thời điểm.",
        icon: <IconCalendar size={28} />,
        color: "green",
    },
    {
        type: "triggered",
        title: "Triggered Flow - Quy trình tự động theo điều kiện",
        description:
            "Khởi chạy khi đáp ứng điều kiện nhất định, giúp kích hoạt và thực hiện các công việc tiếp theo trong quy trình một cách tự động.",
        icon: <IconBolt size={28} />,
        color: "orange",
    },
    {
        type: "sequence",
        title: "Sequence - Chuỗi hành động",
        description:
            "Thực hiện lần lượt các bước theo trình tự đã thiết lập, cho phép gán người phụ trách và điều kiện chuyển bước nhằm đảm bảo quy trình diễn ra đúng kế hoạch.",
        icon: <IconPlaylist size={28} />,
        color: "violet",
    },
];

export default function ProcessesPage() {
    const [data, setData] = useState([]);

    const [dataItem, setDataItem] = useState({});
    const [dataTotal, setDataTotal] = useState(0);
    const [opened, setOpened] = useState(false);
    const [selected, setSelected] = useState<FlowType | null>(null);

    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);

    const [name, setName] = useState("");
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    // Permissions state
    const [permissions, setPermissions] = useState<Permission[]>([
        { id: 1, type: "Nhân sự", include: "Bao gồm", user: "", role: "Xem" },
    ]);

    const [openedUpdate, setOpenedUpdate] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (!token) {
                router.replace('/login')
            } else {
                fetchData();
            }
        }
    }, [router])


    const addPermission = () => {
        setPermissions([
            ...permissions,
            {
                id: Date.now(),
                type: "Nhân sự",
                include: "Bao gồm",
                user: "",
                role: "Xem",
            },
        ]);
    };

    const updatePermission = (
        id: number,
        field: keyof Permission,
        value: string
    ) => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const removePermission = (id: number) => {
        setPermissions(permissions.filter((p) => p.id !== id));
    };

    const handleSubmit = async () => {
        const formData = {
            name,
            version,
            description,
            permissions,
        };

        try {
            const obj = {
                name: formData.name,
                version: formData.version,
                description: formData.description,
                permissions: formData.permissions,
                type: dataItem["type"],
                status: dataItem["status"],
                publish: dataItem["publish"],
                content: dataItem["content"],
                dataField: dataItem["dataField"],
                xmlString: dataItem["xmlString"],
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
                } else {
                    const dataOpen = await response.json();
                    setOpenedUpdate(false);
                    fetchData();
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                throw error; // Re-throw the error for further handling
            }
        } catch (err) {
            console.error('Error exporting XML:', err);
        }
    };


    async function fetchData() {
        const url = "https://workflow.bytebuffer.co/workflow"
        try {
            const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers:
                {
                    'Content-Type': "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const dataOpen = await response.json();
            if (dataOpen.rd === "Success") {
                setData(dataOpen.data);
                setDataTotal(dataOpen.total);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    const handleDetail = (data) => {
        setDataItem(data);
        setName(data.name);
        setVersion(data.version);
        setDescription(data.description);
        setPermissions(data.permissions);
        setOpenedUpdate(true);
    }

    const hanleCreate = () => {
        // const params = new URLSearchParams({ type: selected });

        // const params = new URLSearchParams(searchParams.toString());
        // params.set("type", "manual_flow");
        // const dataParams ="create?type=" + selected;

        router.push(`/process/create/${selected}`, { scroll: false });
        setOpened(false)
    }

    const handleDelete = async (data: string) => {
        setSelected("");
        const url = "https://workflow.bytebuffer.co/workflow"
        try {
            const response = await fetch(url, {
                method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": data
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const dataOpen = await response.json();
            if (dataOpen.rd === "OK") {
                showNotification({
                    title: 'thành công',
                    message: "Delete success",
                    color: 'green',
                    icon: <IconCheck />
                })
                fetchData();
            } else {
                showNotification({
                    title: 'Lỗi',
                    message: "Delete error",
                    color: 'red',
                    icon: <IconX />
                })
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            showNotification({
                title: 'Lỗi',
                message: "Delete error",
                color: 'red',
                icon: <IconX />
            })
            throw error; // Re-throw the error for further handling
        }
    }

    return (
        <div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Quản lý quy trình ({dataTotal})</h2>
                    <div className="flex gap-2">
                        <Button className="mr-[var(--mantine-spacing-md)]" variant="default">
                            ⚙ Cài đặt
                        </Button>
                        <Button onClick={() => setOpened(true)} color="violet">
                            + Tạo
                        </Button>
                        <Modal
                            opened={opened}
                            onClose={() => setOpened(false)}
                            title="Tạo quy trình"
                            size="lg"
                            radius="md"
                            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
                            className="text-black"
                        >
                            <Text size="sm" mb="md">
                                Vui lòng chọn loại quy trình mà bạn muốn tạo.
                            </Text>

                            <Stack>
                                {flowOptions.map((flow) => {
                                    const isActive = selected === flow.type;

                                    return (
                                        <Paper
                                            key={flow.type}
                                            withBorder
                                            p="md"
                                            radius="md"
                                            onClick={() => setSelected(flow.type)}
                                            onDoubleClick={() => {
                                                setSelected(flow.type);
                                                hanleCreate();
                                            }}
                                            style={{
                                                cursor: "pointer",
                                                borderColor: isActive ? "#228be6" : undefined, // xanh Mantine
                                                backgroundColor: isActive ? "#e7f5ff" : undefined,
                                            }}
                                        >
                                            <Flex direction={{ base: 'column', sm: 'row' }}
                                                gap={{ base: 'sm', sm: 'lg' }}
                                                justify={{ sm: 'center' }}
                                                align={{ sm: 'center' }}
                                            >
                                                <ThemeIcon color={flow.color} variant="light" size="lg" radius="xl">
                                                    {flow.icon}
                                                </ThemeIcon>
                                                <div>
                                                    <Text fw={500} c={isActive ? "blue" : undefined}>
                                                        {flow.title}
                                                    </Text>
                                                    <Text size="sm" c="dimmed">
                                                        {flow.description}
                                                    </Text>
                                                </div>
                                            </Flex>
                                        </Paper>
                                    );
                                })}
                            </Stack>

                            <Group justify="flex-end" mt="xl">
                                <Button variant="default" onClick={() => setOpened(false)}>
                                    Hủy
                                </Button>
                                <Button disabled={!selected} onClick={hanleCreate}>
                                    Tạo
                                </Button>
                            </Group>
                        </Modal>
                    </div>
                </div>

                <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                    <Table miw={700}>
                        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                            <Table.Tr>
                                <Table.Th>Tên quy trình</Table.Th>
                                <Table.Th>Phân loại</Table.Th>
                                <Table.Th>Trạng thái xuất bản</Table.Th>
                                <Table.Th>Trạng thái</Table.Th>
                                <Table.Th>Người tạo</Table.Th>
                                <Table.Th>Thời gian tạo</Table.Th>
                                <Table.Th>Người cập nhật cuối</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.map((wf, idx) => (
                                <Table.Tr key={idx}>
                                    <Table.Td className="hover:cursor-pointer hover:text-pink-500" onClick={() => router.push(`/process/${wf.id}`, { scroll: false })}>{wf.name}</Table.Td>
                                    <Table.Td>
                                        {wf.type === "Manual Flow" ? (
                                            <span className="text-blue-500 font-medium">Manual Flow</span>
                                        ) : (
                                            <span className="text-orange-500 font-medium">Triggered Flow</span>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        {wf.publish === "publish" ? (
                                            <span className="flex items-center gap-1 text-green-600">● Đã xuất bản</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400">● Nháp</span>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        {wf.status === "active" ? (
                                            <span className="flex items-center gap-1 text-green-600">● Đang hoạt động</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-500">● Ngưng</span>
                                        )}</Table.Td>
                                    <Table.Td>{wf.createdBy}</Table.Td>
                                    <Table.Td>{new Date(wf.created_at).toLocaleString()}</Table.Td>
                                    <Table.Td>{wf.updatedBy}</Table.Td>
                                    <Table.Td className="flex items-center justify-end">
                                        <Button onClick={() => handleDetail(wf)} className="mr-[var(--mantine-spacing-md)]"><IconPencil size={14} /></Button>
                                        <Button onClick={() => handleDelete(wf.id)} color="red"><IconTrash size={14} /></Button>
                                        <Modal
                                            opened={openedUpdate}
                                            onClose={() => setOpenedUpdate(false)}
                                            title="Lưu quy trình"
                                            size="lg"
                                            radius="md"
                                            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
                                        >
                                            <Stack gap="md">
                                                <TextInput
                                                    label="Tên quy trình"
                                                    placeholder="Nhập tên quy trình"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.currentTarget.value)}
                                                />
                                                <TextInput
                                                    label="Tên phiên bản"
                                                    placeholder="Nhập tên phiên bản"
                                                    value={version}
                                                    onChange={(e) => setVersion(e.currentTarget.value)}
                                                />
                                                <Textarea
                                                    label="Mô tả"
                                                    placeholder="Nhập mô tả"
                                                    autosize
                                                    minRows={3}
                                                    maxLength={500}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.currentTarget.value)}
                                                />

                                                <div>
                                                    <h3 className="text-sm font-medium mb-2">Phân quyền quy trình mẫu</h3>
                                                    {permissions.map((perm) => (
                                                        <Paper
                                                            key={perm.id}
                                                            withBorder
                                                            p="sm"
                                                            radius="md"
                                                            mb="xs"
                                                            className="flex gap-2 items-center"
                                                        >
                                                            <Select
                                                                data={["Nhân sự", "Phòng ban", "Nhóm"]}
                                                                value={perm.type}
                                                                onChange={(val) =>
                                                                    updatePermission(perm.id, "type", val || "Nhân sự")
                                                                }
                                                                className='flex-1 mb-[var(--mantine-spacing-md)]'
                                                            />
                                                            <Select
                                                                data={["Bao gồm", "Loại trừ"]}
                                                                value={perm.include}
                                                                onChange={(val) =>
                                                                    updatePermission(perm.id, "include", val || "Bao gồm")
                                                                }
                                                                className='flex-1 mb-[var(--mantine-spacing-md)]'
                                                            />
                                                            <TextInput
                                                                placeholder="Chọn nhân sự"
                                                                value={perm.user}
                                                                onChange={(e) =>
                                                                    updatePermission(perm.id, "user", e.currentTarget.value)
                                                                }
                                                                className="flex-1 mb-[var(--mantine-spacing-md)]"
                                                            />
                                                            <Select
                                                                data={["Xem", "Sửa", "Toàn quyền"]}
                                                                value={perm.role}
                                                                onChange={(val) =>
                                                                    updatePermission(perm.id, "role", val || "Xem")
                                                                }
                                                                className='mb-[var(--mantine-spacing-md)]'
                                                            />
                                                            <Button
                                                                variant="subtle"
                                                                color="red"
                                                                onClick={() => removePermission(perm.id)}
                                                            >
                                                                🗑
                                                            </Button>
                                                        </Paper>
                                                    ))}
                                                    <Button variant="light" size="xs" onClick={addPermission}>
                                                        + Phân quyền thêm
                                                    </Button>
                                                </div>

                                                <Group justify="flex-end" mt="md">
                                                    <Button variant="default" onClick={() => setOpenedUpdate(false)}>
                                                        Hủy
                                                    </Button>
                                                    <Button onClick={handleSubmit}>Đồng ý</Button>
                                                </Group>
                                            </Stack>
                                        </Modal>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </div>
            {/* {page === "detailAndCreate" && <DetailAndCreatePage idBP={id} onButtonClick={handleChildClick} type={selected} />} */}
        </div>

    );
}