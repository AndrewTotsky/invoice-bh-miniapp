import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
    TextInput,
    NumberInput,
    Select,
    Button,
    Box,
    Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
export default function PaymentForm() {
    const form = useForm({
        initialValues: {
            rubles: "",
            kopecks: "",
            periodStart: null,
            periodEnd: null,
            invoiceNumber: "",
            invoiceDate: null,
            counterparty: "",
            service: "",
            plan: "Атмосфера",
            planArticle: "",
        },
        validate: {
            rubles: (value) =>
                /^\d+$/.test(value)
                    ? null
                    : "Введите корректное количество рублей",
            kopecks: (value) =>
                /^\d{0,2}$/.test(value) ? null : "Введите 0-99 копеек",
            invoiceNumber: (value) =>
                value.length > 0 ? null : "Обязательное поле",
            invoiceDate: (value) => (value ? null : "Обязательное поле"),
            periodStart: (value) => (value ? null : "Обязательное поле"),
            periodEnd: (value) => (value ? null : "Обязательное поле"),
            counterparty: (value) =>
                value.length > 0 ? null : "Обязательное поле",
            service: (value) => (value.length > 0 ? null : "Обязательное поле"),
            planArticle: (value) =>
                value.length > 0 ? null : "Обязательное поле",
        },
    });

    const [resultText, setResultText] = useState("");

    const handleSubmit = (values) => {
        const {
            rubles,
            kopecks,
            invoiceNumber,
            invoiceDate,
            periodStart,
            periodEnd,
            counterparty,
            service,
            planArticle,
        } = values;
        const amount = `${rubles} руб. ${kopecks} коп.`;
        const invoice = `№${invoiceNumber} от ${
            invoiceDate ? invoiceDate : ""
        }`;
        const period = `с ${periodStart ? periodStart : ""} по ${
            periodEnd ? periodEnd : ""
        }`;
        const resultInvoice = [
            `«Прошу согласовать оплату в сумме ${amount}`,
            ` по счету ${invoice}`,
            ` за период ${period}`,
            ` подрядчику ${counterparty}`,
            ` за ${service}`,
            ` по МП ${planArticle}`,
        ].join("");
        setResultText(resultInvoice);
    };
    return (
        <Box sx={{ maxWidth: 400 }} mx="auto" mt="50px">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Group grow spacing="sm">
                    <NumberInput
                        label="Рубли"
                        placeholder="789"
                        {...form.getInputProps("rubles")}
                        min={0}
                        hideControls
                    />
                    <NumberInput
                        label="Копейки"
                        placeholder="99"
                        {...form.getInputProps("kopecks")}
                        min={0}
                        max={99}
                        hideControls
                    />
                </Group>

                <Group grow spacing="sm" mb="sm">
                    <TextInput
                        label="Номер счета"
                        placeholder="46"
                        {...form.getInputProps("invoiceNumber")}
                    />
                    <DateInput
                        label="Дата счета"
                        placeholder="Выберите дату"
                        {...form.getInputProps("invoiceDate")}
                        valueFormat="DD.MM.YYYY"
                    />
                </Group>

                <Group grow spacing="sm" mb="sm">
                    <DateInput
                        label="Дата начала"
                        placeholder="Выберите дату начала"
                        {...form.getInputProps("periodStart")}
                        valueFormat="DD.MM.YYYY"
                    />
                    <DateInput
                        label="Дата окончания"
                        placeholder="Выберите дату окончания"
                        {...form.getInputProps("periodEnd")}
                        valueFormat="DD.MM.YYYY"
                    />
                </Group>
                <TextInput
                    label="Контрагент"
                    {...form.getInputProps("counterparty")}
                    mb="sm"
                />
                <TextInput
                    label="Наименование услуги"
                    {...form.getInputProps("service")}
                    mb="sm"
                />

                <Select
                    label="Медиаплан"
                    data={["Атмосфера", "БХ"]}
                    {...form.getInputProps("plan")}
                    mb="sm"
                />
                <TextInput
                    label="Напиши название статьи медиаплана"
                    {...form.getInputProps("planArticle")}
                    mb="sm"
                />
                <Button type="submit" fullWidth mt="md">
                    Предварительный просмотр
                </Button>
            </form>

            {resultText && (
                <Box
                    mt="md"
                    p="md"
                    sx={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        lineHeight: "1.5",
                    }}
                >
                    <strong>Итоговый текст:</strong>
                    <br />
                    {resultText}
                </Box>
            )}
        </Box>
    );
}
