import { fetchTarifas } from "@/lib/services/supabase";
import { verificarSesionPanel } from "@/app/actions/panelAuth";
import PanelLogin from "@/components/ui/PanelLogin";
import PanelTarifasForm from "@/components/ui/PanelTarifasForm";

export const dynamic = "force-dynamic";

export default async function PanelTarifasPage() {
    const autenticado = await verificarSesionPanel();

    if (!autenticado) {
        return <PanelLogin />;
    }

    const tarifas = await fetchTarifas();
    return <PanelTarifasForm tarifasIniciales={tarifas} />;
}