import {ComponentProps} from "react";
import classNames from "classnames";

export interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'primary'|'danger'
}

export function Button(props: ButtonProps) {
    const className = classNames(
        "px-3 py-2 rounded-md transition-colors",
        {
            'bg-teal-600 text-white hover:bg-teal-700': !props.variant || props.variant === 'primary',
            'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger'
        },
        props.className
    );

    return (
        <button {...props} className={className} />
    )
}
