import * as React from 'react';
import { Dropdown, Option, OptionOnSelectData, SelectionEvents } from '@fluentui/react-components';
import { CustomDropdownProps } from '../types/CustomDropdownProps';

const DropdownComponent: React.FC<CustomDropdownProps> = (props) => {
    const { index, item, type, options, updateValue } = props;
    const [value, setValue] = React.useState("");
    const minWidth = type === 'documentType' ? '250px' : '175px';

    const onOptionSelect = (ev: SelectionEvents, data: OptionOnSelectData) => {
        setValue(data.optionText ?? "");
        updateValue(index, data.optionText ?? "");
    };

    React.useEffect(() => {
        setValue(item[type]);
    }, [item]);

    return (
        <Dropdown
            value={value}
            selectedOptions={[item[type]]}
            onOptionSelect={onOptionSelect}
            style={{ minWidth: minWidth }}
        >
            {options.map(opt => (
                <Option key={opt}>{opt}</Option>
            ))}
        </Dropdown>
    );
};

export default DropdownComponent;
