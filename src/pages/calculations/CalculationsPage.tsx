import { useForm } from "react-hook-form";
import { useState } from "react";
import { IconBtn } from "../../components/button/IconBtn";
import { CloseIcon } from "../../components/svg/CloseIcon";
import { Btn } from "../../components/button/Btn";
import { SvgIcon } from "../../components/svg/SvgIcon";

type WindowDoorType = {
    width: string;
    height: string;
};

type FormValues = {
    length: string;
    width: string;
    height: string;
    rapport: string;
    rulon: string;
};

type CalculationResult = {
    rollsNeeded: number;
    totalWallpaperArea: number;
    netArea: number;
};

export const CalculationsPage = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: "onBlur",
        defaultValues: {
            length: "",
            width: "",
            height: "",
            rulon: "10",
            rapport: "0",
        },
    });

    const [rapport, setRapport] = useState("0");
    const [rulon, setRulon] = useState("10");
    const [windows, setWindows] = useState<WindowDoorType[]>([]);
    const [doors, setDoors] = useState<WindowDoorType[]>([]);
    const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);

    // Обновление раппорта и рулона
    const updateRapportState = (val: string) => {
        setRapport(val);
    };

    const updateRulonState = (val: string) => {
        setRulon(val);
    };

    // Управление окнами
    const addNewWindow = () => {
        setWindows((prev) => [...prev, { width: "", height: "" }]);
    };

    const delItemWindow = (index: number) => {
        setWindows((prev) => prev.filter((_, i) => i !== index));
    };

    const updateItemWindow = (value: string, index: number, field: "width" | "height") => {
        setWindows((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Управление дверями – логика аналогична окнам
    const addNewDoor = () => {
        setDoors((prev) => [...prev, { width: "", height: "" }]);
    };

    const delItemDoor = (index: number) => {
        setDoors((prev) => prev.filter((_, i) => i !== index));
    };

    const updateItemDoor = (value: string, index: number, field: "width" | "height") => {
        setDoors((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Функция расчёта количества рулонов обоев
    const calculateWallpaperRolls = (data: FormValues): CalculationResult | null => {
        const { length, width, height } = data;
        if (!length || !width || !height) {
            alert("Введите параметры комнаты");
            return null;
        }

        // Преобразуем строковые значения в числа
        const roomLength = Number(length);
        const roomWidth = Number(width);
        const roomHeight = Number(height);
        if (isNaN(roomLength) || isNaN(roomWidth) || isNaN(roomHeight)) {
            alert("Некорректные параметры комнаты");
            return null;
        }

        // Расчёт периметра и площади стен
        const roomPerimeter = 2 * (roomLength + roomWidth);
        const roomWallArea = roomPerimeter * roomHeight;

        // Вычисление суммарной площади окон и дверей
        const totalWindowArea = windows.reduce((sum, win) => sum + Number(win.width) * Number(win.height), 0);
        const totalDoorArea = doors.reduce((sum, door) => sum + Number(door.width) * Number(door.height), 0);

        const netArea = roomWallArea - (totalWindowArea + totalDoorArea);
        if (netArea <= 0) {
            alert("Площадь вычетов (окон/дверей) превышает площадь стен");
            return null;
        }

        // Площадь одного рулона обоев: ширина рулона фиксирована 1.06 м, длина берётся из состояния
        const rollLength = Number(rulon);
        const wallpaperRollArea = 1.06 * rollLength;

        // Количество рулонов, округляем вверх
        const rollsNeeded = Math.ceil(netArea / wallpaperRollArea);
        const totalWallpaperArea = rollsNeeded * wallpaperRollArea;

        return {
            rollsNeeded,
            totalWallpaperArea,
            netArea,
        };
    };

    const onSubmit = (data: FormValues) => {
        const result = calculateWallpaperRolls(data);
        if (result) {
            setCalcResult(result);
        }
    };

    const resetAll = () => {
        // Сброс значений формы
        reset();
        // Сброс состояния
        setRapport("0");
        setRulon("10");
        setWindows([]);
        setDoors([]);
        setCalcResult(null);
    };

    return (
        <div className="container container__lg">
            <div className="card relative">
                <div className="absolute" style={{ top: ".8rem", right: ".8rem" }}>
                    <IconBtn type="link" to="/" icon={<CloseIcon />} bg="light" />
                </div>

                <h2 className="title__v7 mb-3">Параметры комнаты</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Параметры комнаты */}
                    <div className="d-flex mb-8">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="length">Длина м</label>
                            <input
                                id="length"
                                inputMode="numeric"
                                placeholder="14.2"
                                className={`form-input ${errors.length ? "error" : ""}`}
                                {...register("length", {
                                    required: "Это поле обязательно",
                                    min: { value: 0.01, message: "Число должно быть больше 0" },
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                        message: "Введите число в формате 14.2",
                                    },
                                })}
                            />
                            {errors.length && <p className="error-text">{errors.length.message}</p>}
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="width">Ширина м</label>
                            <input
                                id="width"
                                inputMode="numeric"
                                placeholder="28.5"
                                className={`form-input ${errors.width ? "error" : ""}`}
                                {...register("width", {
                                    required: "Это поле обязательно",
                                    min: { value: 0.01, message: "Число должно быть больше 0" },
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                        message: "Введите число в формате 28.5",
                                    },
                                })}
                            />
                            {errors.width && <p className="error-text">{errors.width.message}</p>}
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="height">Высота м</label>
                            <input
                                id="height"
                                inputMode="numeric"
                                placeholder="18.5"
                                className={`form-input ${errors.height ? "error" : ""}`}
                                {...register("height", {
                                    required: "Это поле обязательно",
                                    min: { value: 0.01, message: "Число должно быть больше 0" },
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                        message: "Введите число в формате 18.5",
                                    },
                                })}
                            />
                            {errors.height && <p className="error-text">{errors.height.message}</p>}
                        </div>
                    </div>

                    {/* Параметры рулона и раппорта */}
                    <div className="d-flex mb-5">
                        <div className="col-12 col-lg-6 mb-3">
                            <h2 className="title__v7 mb-3">Параметры рулона</h2>
                            <div className="gap gap-3">
                                <Btn
                                    className={rulon !== "10" ? "btn--disabled" : ""}
                                    onClick={() => updateRulonState("10")}
                                    text="1.06 x 10м"
                                />
                                <Btn
                                    className={rulon !== "25" ? "btn--disabled" : ""}
                                    onClick={() => updateRulonState("25")}
                                    text="1.06 x 25м"
                                />
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                            <h2 className="title__v7 mb-3">Раппорт</h2>
                            <div className="gap gap-3">
                                <Btn
                                    className={rapport !== "0" ? "btn--disabled" : ""}
                                    onClick={() => updateRapportState("0")}
                                    text="0"
                                />
                                <Btn
                                    className={rapport !== "0.32" ? "btn--disabled" : ""}
                                    onClick={() => updateRapportState("0.32")}
                                    text="0.32м"
                                />
                                <Btn
                                    className={rapport !== "0.64" ? "btn--disabled" : ""}
                                    onClick={() => updateRapportState("0.64")}
                                    text="0.64м"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Параметры окон */}
                    <div className="d-flex mb-5">
                        <div className="col-12">
                            <h2 className="title__v7 mb-3">Параметры окон</h2>
                        </div>
                        <div className="gap gap-2">
                            {windows.map((el, i) => (
                                <div key={i} className="mini--card align-items-end d-flex-nowrap">
                                    <div className="absolute" style={{ top: "0.1rem", right: "0.2rem" }}>
                                        <IconBtn onClick={() => delItemWindow(i)} bg="light" icon={<CloseIcon />} />
                                    </div>
                                    <h5 className="absolute p__medium" style={{ top: "0.5rem", left: "1rem" }}>
                                        Окно
                                    </h5>
                                    <div className="d-flex-nowrap gap-2" style={{ padding: ".8rem" }}>
                                        <div className="d-inline">
                                            <label>Высота м</label>
                                            <input
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={el.height}
                                                onChange={(e) => updateItemWindow(e.target.value, i, "height")}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="d-inline">
                                            <label>Ширина м</label>
                                            <input
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={el.width}
                                                onChange={(e) => updateItemWindow(e.target.value, i, "width")}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="mini--card d-flex align-items-center justify-content-center flex-direction-column"
                                onClick={addNewWindow}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="44"
                                    height="44"
                                    fill="none"
                                    viewBox="0 0 44 44"
                                >
                                    <g opacity="0.2">
                                        <rect width="44" height="44" fill="#526EFF" rx="22"></rect>
                                        <path
                                            fill="#fff"
                                            d="M17 14v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0m-5 5h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2m21 4v9a1 1 0 0 1-1 1H18a1 1 0 0 1-1-1V18a1 1 0 0 1 1-1h9c.263.012.513.116.707.293l5 5c.18.192.284.444.293.707m-2 1h-4a1 1 0 0 1-1-1v-4h-7v12h12z"
                                        ></path>
                                    </g>
                                </svg>
                                <p>Добавить окно</p>
                            </div>
                        </div>
                    </div>

                    {/* Параметры дверей */}
                    <div className="d-flex mb-5">
                        <div className="col-12">
                            <h2 className="title__v7 mb-3">Параметры дверей</h2>
                        </div>
                        <div className="gap gap-2">
                            {doors.map((el, i) => (
                                <div key={i} className="mini--card align-items-end d-flex-nowrap">
                                    <div className="absolute" style={{ top: "0.1rem", right: "0.2rem" }}>
                                        <IconBtn onClick={() => delItemDoor(i)} bg="light" icon={<CloseIcon />} />
                                    </div>
                                    <h5 className="absolute p__medium" style={{ top: "0.5rem", left: "1rem" }}>
                                        Дверь
                                    </h5>
                                    <div className="d-flex-nowrap gap-2" style={{ padding: ".8rem" }}>
                                        <div className="d-inline">
                                            <label>Высота м</label>
                                            <input
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={el.height}
                                                onChange={(e) => updateItemDoor(e.target.value, i, "height")}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="d-inline">
                                            <label>Ширина м</label>
                                            <input
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={el.width}
                                                onChange={(e) => updateItemDoor(e.target.value, i, "width")}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="mini--card d-flex align-items-center justify-content-center flex-direction-column"
                                onClick={addNewDoor}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="44"
                                    height="44"
                                    fill="none"
                                    viewBox="0 0 44 44"
                                >
                                    <g opacity="0.2">
                                        <rect width="44" height="44" fill="#526EFF" rx="22"></rect>
                                        <path
                                            fill="#fff"
                                            d="M17 14v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0m-5 5h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2m21 4v9a1 1 0 0 1-1 1H18a1 1 0 0 1-1-1V18a1 1 0 0 1 1-1h9c.263.012.513.116.707.293l5 5c.18.192.284.444.293.707m-2 1h-4a1 1 0 0 1-1-1v-4h-7v12h12z"
                                        ></path>
                                    </g>
                                </svg>
                                <p>Добавить дверь</p>
                                {/* Здесь добавлена логика управления дверьми:
                    каждое дверь управляется отдельно, можно добавлять/удалять любое количество дверей */}
                            </div>
                        </div>
                    </div>

                    {/* Если расчёт ещё не произведён, показываем кнопку "Рассчитать материалы" */}
                    {!calcResult && (
                        <div className="mt-8">
                            <Btn icon={<SvgIcon />} type="submit" disabled={!isValid} text="Рассчитать материалы" />
                        </div>
                    )}

                    {/* Контейнер с результатами, отображается после успешного расчёта */}
                    {calcResult && (
                        <div className="bg-primary card-container mt-8">
                            <h2 className="mb-5 title__v4 color-white">Результаты</h2>
                            <div className="d-flex align-items-center gap-5 mb-5">
                                <div>
                                    <h6 className="mb-1 title__v7 color-white">{calcResult.rollsNeeded}</h6>
                                    <p className="color-gray p__small">Кол-во рулонов</p>
                                </div>
                                <div>
                                    <h6 className="mb-1 title__v7 color-white">{calcResult.totalWallpaperArea.toFixed(1)} м²</h6>
                                    <p className="color-gray p__small">Кол-во м² обоев</p>
                                </div>
                                <div>
                                    <h6 className="mb-1 title__v7 color-white">{calcResult.netArea.toFixed(1)} м²</h6>
                                    <p className="color-gray p__small">Площадь оклейки</p>
                                </div>
                            </div>
                            <div className="gap gap-4">
                                <button type="button" className="btn btn__v1--white" onClick={resetAll}>
                                    Сбросить параметры
                                </button>
                                <button type="button" className="btn btn__v2--white">
                                    Перейти в каталог
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
