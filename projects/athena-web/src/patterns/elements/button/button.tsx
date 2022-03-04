import {ComponentProps} from "react";
import classNames from "classnames";

export function Button(props: ComponentProps<'button'>) {
    const className = classNames(
        "bg-teal-600 text-white px-3 py-2 rounded-md",
        "hover:bg-teal-700 transition-colors",
        props.className
    );

    return (
        <button {...props} className={className} />
    )
}
