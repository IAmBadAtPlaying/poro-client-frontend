import ReworkedSkinSelector from './ContainerPlay/GameflowChampSelect/ReworkedSkinSelector';

export default function ContainerLoot() {
    return (
        <>
            <div style={{
                height: '30%',
                width: '100%'
            }}>
                <div style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    border: '2px solid black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        height: '60%',
                        width: '40%',
                        border: '2px solid red',
                        zIndex: 100
                    }}>

                    </div>
                </div>
                <ReworkedSkinSelector championId={103} />
            </div>
        </>
    );
}