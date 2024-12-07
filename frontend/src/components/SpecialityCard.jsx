export default function SpecialityCard({specialityData, onClick}) {
    return (
        <div
            className="flex w-52 h-12 hover:cursor-pointer hover:bg-purple-300 items-center justify-center border border-black bg-purple-100"
            onClick={() => onClick(specialityData?.title)}>
            <span>{specialityData?.title}</span>
        </div>
    )
}
