import {ComponentProps} from "react";
import classNames from "classnames";

export interface ButtonLinkProps extends ComponentProps<'a'> {
    variant?: 'primary' | 'danger';
}

export function ButtonLink(props: ButtonLinkProps) {
    const className = classNames(
        "inline-block",
        "px-3 py-2 rounded-md transition-colors",
        {
            'bg-teal-600 text-white hover:bg-teal-700': !props.variant || props.variant === 'primary',
            'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger'
        },
        props.className
    );

    return (
        <a {...props} className={className} />
    )
}
