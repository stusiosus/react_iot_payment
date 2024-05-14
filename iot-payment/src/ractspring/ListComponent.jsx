import ListEntry from './ListEntry';

export default function ListComponent({ items }) {


    
    return (
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor:"" }}>
            {items.map((item, index) => (
                <ListEntry key={index} id={index.toString()} text={item.name} sx={{position:"absolute",top:"1000px"}}/>
            ))}
        </div>
       
    );
}
