import {specialitiesApi} from "../api/specialities.js";
import {useContext, useEffect, useState} from "react";
import SpecialityCard from "./SpecialityCard.jsx";
import {Link} from "react-router-dom";
import {AppContext} from "../AppContext.jsx";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SpecialitiesList() {
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setSpeciality} = useContext(AppContext);

    const loadSpecialities = async () => {
        setLoading(true);
        try {
            const res = await specialitiesApi.getSpecialities()
            setSpecialities(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSpecialities()
    }, [])

    const handleClick = (speciality) => {
        if (speciality.trim() !== "Все") {
            setSpeciality(speciality)
        } else {
            setSpeciality("");
        }
    }

    return (
        <div className="flex p-7 gap-10 flex-wrap">
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
                    {specialities?.map((speciality, index) => (
                        <Link key={index} to={"/specialists"}>
                            <SpecialityCard
                                key={speciality?.speciality_id}
                                specialityData={speciality}
                                onClick={handleClick}
                            />
                        </Link>
                    ))}
                    <Link to={"/specialists"}>
                        <SpecialityCard
                            key={"1"}
                            specialityData={{title: "Все"}}
                            onClick={handleClick}
                        />
                    </Link>
                </>
            )}
        </div>
    )
}
