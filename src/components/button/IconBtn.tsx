import { FC } from "react"
import { Link } from "react-router-dom"
import style from "./btn.module.scss"

// Определяем базовые пропсы, которые общие для всех типов
type BaseIconBtnProps = {
    text?: string
    className?: string
    icon?: React.ReactNode
    bg?: string
}

// Определяем пропсы для ссылки
type LinkIconBtnProps = BaseIconBtnProps & {
    type: "link"
    to: string
}

// Определяем пропсы для кнопки
type ButtonIconBtnProps = BaseIconBtnProps & {
    type?: "button" | "submit"
    onClick?: () => void
}

// Объединяем типы
type IconBtnProps = LinkIconBtnProps | ButtonIconBtnProps

export const IconBtn: FC<IconBtnProps> = ({
    type = "button",
    bg = 'primary',
    text,
    className = "",
    icon,
    ...props
}) => {
    const baseClasses = "d-flex align-items-center justify-content-center"

    // Если тип "link", рендерим ссылку
    if (type === "link") {
        const { to } = props as LinkIconBtnProps // Приводим тип к LinkIconBtnProps
        return (
            <Link to={to} className={`${bg == 'primary' ? style.IconBtn : style.IconBtnLight} ${baseClasses} ${className}`}>
                {icon}&nbsp;<span>{text}</span>
            </Link>
        )
    }

    // Во всех остальных случаях рендерим кнопку
    const { onClick } = props as ButtonIconBtnProps // Приводим тип к ButtonIconBtnProps
    return (
        <button
            type={type}
            className={`${bg === 'primary' ? style.IconBtn : style.IconBtnLight} ${baseClasses} ${className}`}
            onClick={onClick}
        >
            {icon}&nbsp;<span>{text}</span>
        </button>
    )
}