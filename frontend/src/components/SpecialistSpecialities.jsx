import {useEffect, useState, useContext} from "react";
import {specialitiesApi} from "@/api/specialities";
import {AppContext} from "@/AppContext.jsx";

export default function SpecialistSpecialities({specialistId}) {
    const {user, role} = useContext(AppContext);
    const [specialities, setSpecialities] = useState([]);
    const [allSpecialities, setAllSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);
    const [loading, setLoading] = useState(false);

    const isEditable = role === "admin" || user === specialistId;


    const loadSpecialistSpecialities = async () => {
        try {
            setLoading(true);
            const res = await specialitiesApi.getSpecialitiesBySpecialistId(specialistId);
            setSpecialities(res.data);
        } catch (error) {
            console.error("Ошибка при загрузке специальностей:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadAllSpecialities = async () => {
        try {
            const res = await specialitiesApi.getSpecialities();
            setAllSpecialities(res.data);
        } catch (error) {
            console.error("Ошибка при загрузке всех специальностей:", error);
        }
    };

    const handleAddSpeciality = async () => {
        if (!selectedSpeciality) return;
        try {
            await specialitiesApi.createRelationSpecialistSpeciality(specialistId, selectedSpeciality);
            loadSpecialistSpecialities();
        } catch (error) {
            console.error("Ошибка при добавлении специальности:", error);
        }
    };

    const handleDeleteSpeciality = async (specialityId) => {
        try {
            await specialitiesApi.deleteRelationSpecialistSpeciality(specialistId, specialityId);
            loadSpecialistSpecialities();
        } catch (error) {
            console.error("Ошибка при удалении специальности:", error);
        }
    };

    useEffect(() => {
        loadSpecialistSpecialities();
        if (isEditable) {
            loadAllSpecialities();
        }
    }, [specialistId]);

    return (
        <div className="mb-6">
            <h2 className="font-bold text-xl">Специальности</h2>
            {loading ? (
                <p>Загрузка специальностей...</p>
            ) : (
                <ul>
                    {specialities.map((speciality) => (
                        <li key={speciality.speciality_id} className="flex items-center gap-2">
                            <span>{speciality.title}</span>
                            {isEditable && (
                                <button
                                    onClick={() => handleDeleteSpeciality(speciality.speciality_id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Удалить
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {isEditable && (
                <div className="mt-4">
                    <h3 className="font-bold text-lg">Добавить специальность</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <select
                            value={selectedSpeciality || ""}
                            onChange={(e) => setSelectedSpeciality(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                        >
                            <option value="" disabled>
                                Выберите специальность
                            </option>
                            {allSpecialities.map((speciality) => (
                                <option key={speciality.speciality_id} value={speciality.speciality_id}>
                                    {speciality.title}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddSpeciality}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
