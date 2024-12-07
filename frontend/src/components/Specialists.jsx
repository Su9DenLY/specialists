import {useContext, useEffect, useState} from "react";
import {AppContext} from "../AppContext.jsx";
import {specialistsApi} from "../api/specialists.js";
import SpecialistPreview from "./SpecialistPreview.jsx";
import Skeleton from "react-loading-skeleton";

export default function Specialists({}) {
    const {speciality} = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [specialists, setSpecialists] = useState([]);

    const loadSpecialists = async () => {
        setLoading(true);
        try {
            if (speciality.trim()) {
                const res = await specialistsApi.getSpecialistsBySpeciality(speciality)
                setSpecialists(res.data)
            } else {
                const res = await specialistsApi.getSpecialists()
                setSpecialists(res.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSpecialists();
    }, [])

    return (
        <div className="flex w-full h-full flex-col items-center gap-8">
            {loading ? (
                <div className="flex flex-row w-full flex-wrap gap-8">
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                    <Skeleton height={48} width={208}/>
                </div>
            ) : (
                <>
                    {specialists.map((specialist) => {
                        return (
                            <SpecialistPreview key={specialist?.user_id} specialistData={specialist}/>
                        )
                    })}
                </>
            )}
        </div>
    )
}
