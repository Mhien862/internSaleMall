import { img } from "../../utils";

const CustomClearText = () => (
    <>
        <img src={img.clearIcon} style={{ marginTop: "6px" }} />
    </>
);

export const ClearIndicator = (props) => {
    const {
        children = <CustomClearText />,
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