import { forwardRef, useEffect } from "react";

const Button = forwardRef(({children, type, onClick, colorStyling, size, onKeyDown}, ref) => {
    
    // delete modal 
    useEffect(() => {
        if (ref && ref.current && children === 'Delete'){
            ref.current.focus();
        }
    }, [ref, children])
    
    const styling = {
        textColor: 'text-black-800',
        background: 'bg-green-200',
        hoverBackground: 'hover:bg-green-300',
    }

    const sizing = {
        paddingInline: 'px-4',
        paddingBlock: 'py-2',
        fontSize: 'text-base',
        fontWeight: 'font-normal'
    }

    if (colorStyling){
        switch(colorStyling){
            case 'accent':
                styling.textColor = 'text-black-800';
                styling.background = 'bg-orange-200';
                styling.hoverBackground = 'hover:bg-orange-300';
                break;
            case 'secondary':
                styling.background = 'bg-blue-200';
                styling.hoverBackground = 'hover:bg-blue-300';
                break;
            case 'dark':
                styling.background = 'bg-black-800';
                styling.hoverBackground = 'hover:bg-black-700'
                break;
            default:
                break;
        }
    }

    if (size){
        switch(size){
            case 'medium':
                sizing.fontSize = 'text-md md:text-lg';
                sizing.fontWeight = 'font-medium';
                sizing.paddingBlock = 'py-2 md:py-2.5';
                sizing.paddingInline = 'px-4 md:px-6';
                break;
            case 'large':
                sizing.fontSize = 'text-xl';
                sizing.fontWeight = 'font-medium';
                sizing.paddingBlock = 'py-3';
                sizing.paddingInline = 'px-7';
                break;
            default:
                break;
        }
    }

    const buttonClasses = `${Object.values(sizing).join(' ')} ${Object.values(styling).join(' ')} border-none rounded cursor-pointer duration-100 shadow-md`;

    return (
        <button 
        className={buttonClasses}
        type={type}
        onClick={onClick}
        ref={ref}
        onKeyDown={onKeyDown}
        >
            {children}
        </button>
    )
})

export default Button;