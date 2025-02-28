import { FC } from "react"
import { Link } from "react-router-dom"
import style from "./btn.module.scss"

// Определяем базовые пропсы, которые общие для всех типов
type BaseBtnProps = {
    text: string
    className?: string
    icon?: React.ReactNode
    bg?: string
    disabled?: boolean
}

// Определяем пропсы для ссылки
type LinkBtnProps = BaseBtnProps & {
    type: "link"
    to: string
}

// Определяем пропсы для кнопки
type ButtonBtnProps = BaseBtnProps & {
    type?: "button" | "submit"
    onClick?: () => void
}

// Объединяем типы
type BtnProps = LinkBtnProps | ButtonBtnProps

export const Btn: FC<BtnProps> = ({
    type = "button",
    bg = 'primary',
    text,
    className = "",
    icon,
    disabled,
    ...props
}) => {
    const baseClasses = "btn d-flex align-items-center"

    // Если тип "link", рендерим ссылку
    if (type === "link") {
        const { to } = props as LinkBtnProps // Приводим тип к LinkBtnProps
        return (
            <Link to={to} className={`${bg == 'primary' ? style.btn : style.btnLight} ${baseClasses} ${className}`}>
                {icon && icon}&nbsp;<span>{text}</span>
            </Link>
        )
    }

    // Во всех остальных случаях рендерим кнопку
    const { onClick } = props as ButtonBtnProps // Приводим тип к ButtonBtnProps
    return (
        <button
            disabled={disabled}
            type={type}
            className={`${bg == 'primary' ? style.btn : style.btnLight} ${baseClasses} ${className}`}
            onClick={onClick}
        >
            {icon && icon}&nbsp;<span>{text}</span>
        </button>
    )
}