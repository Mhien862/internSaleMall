import { img } from "../../utils";

const CaretDownIcon = () => (
    <>
        <img src={img.arrowDown} style={{ marginTop: "5px" }} />
    </>
);
export const DropdownIndicator = (props) => {
    const {
        children = <CaretDownIcon />,
        getStyles,
        innerProps: { ref, ...restInnerProps },
    } = props;

    return (
        <div
            {...restInnerProps}
            ref={ref}
            style={getStyles("indicatorsContainer", props)}
        >
            <div style={{}}>{children}</div>
        </div>
    );
};