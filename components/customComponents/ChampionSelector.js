import {useState} from "react";

export default function ChampionSelector({champions, currentValue, onChange}) {

    let defaultValue = (currentValue === undefined) ? "" : currentValue;

    const selectOptions = () => {
        if (champions === undefined) return (<option disabled={true}>No data available</option>);
        if (champions.length === 0) return (<option disabled={true}>No data available</option>);

        let options = [];

        options.push(
            <option value={""} selected={true} disabled={true}>Select an option</option>
        )
        Object.values(champions).sort(function (a,b) {
            return a.name.localeCompare(b.name);
        }).forEach((champion, index) => {
            if (champion.id === -1) return;
            options.push(<option value={champion.id} key={"champion-"+index}>{champion.name}</option>)
        })

        return options;
    }

    return (
        <select onChange={onChange} defaultValue={defaultValue}>
            {selectOptions()}
        </select>
    )
}