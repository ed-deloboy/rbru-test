import { Btn } from "../../components/button/Btn"

export const HomePage = () => {
    return (
        <>
            <div className="container container__md d-flex align-items-center" style={{ minHeight: '100vh' }}>
                <div className="card">
                    <h1 className="title__v1 mb-3">
                        Калькулятор обоев
                    </h1>
                    <p>
                        Онлайн-калькулятор расчета обоев по поможет вам определить число рулонов, требуемых для оклеивания, с учетом окон и дверей. Чтобы получить точные результаты, просто укажите параметры помещения и размеры в специальной таблице. Наша программа также берет в учет повторение рисунка (раппорт), что позволяет оптимизировать расходы на материалы и клей.
                    </p>
                    <div className="d-flex align-items-center justify-content-center mt-10">

                        <Btn text="Начать расчет материалов" type="link" to="/calculations" />
                    </div>
                </div>
            </div>

        </>
    )
}
