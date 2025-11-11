import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

import { GET_credential_access_byid } from "@/connection/access";
import { ApplicationDetail } from "@/connection/interface";
import { GetCookieAccessAs } from "@/function/cookie/access";
import toast from "react-hot-toast";
import { toDBTime } from "@/function/dateTime";

export default function CredentialDetailPage({
  appDetail,
  mutateAppDetail,
}: {
  appDetail: ApplicationDetail | null | undefined;
  mutateAppDetail: () => Promise<ApplicationDetail | null | undefined>;
}) {
  const router = useRouter();
  const [access, setAccess] = useState("");
  const [idAccess, setIdAccess] = useState(-1);

  // Role checking functions
  const isNakes = () => idAccess === 5;
  const isSupervisor = () => idAccess === 4;
  const isHead_of_Installation = () => idAccess === 3;
  const isMitraBersari = () => idAccess === 2;
  const isCommitte = () => idAccess === 1;

  // Status checking functions
  const approveBySupervisor_Yet = () => appDetail?.status_app === 1;
  const approveByHeadOfInstallation_Yet = () => appDetail?.status_app === 2;
  const evaluationOfNakes_Yet = () => appDetail?.status_app === 3;
  const evaluationOfMitrabersari_Yet = () => appDetail?.status_app === 4;
  const approveByViceCommitte_Yet = () => appDetail?.status_app === 5;
  const finalResult = () =>
    appDetail?.status_app === 6 || appDetail?.status_app === 8;

  //Color For classname
  const STATUS_COLORS = {
    PENDING: "bg-amber-100 text-amber-700",
    SUCCESS: "bg-green-100 text-green-700",
    APPROVED: "bg-green-500 text-white",
    REJECTED: "bg-red-500 text-white",
  } as const;

  useEffect(() => {
    getAccess();
  }, []);

  const getAccess = async () => {
    try {
      const access_id = await GetCookieAccessAs();
      const response = await GET_credential_access_byid(Number(access_id));
      if (response && response.length > 0) {
        setAccess(response[0].role_name);
        setIdAccess(response[0].id);
      }
    } catch (error) {
      console.error("Error fetching access data:", error);
      toast.error("Gagal memuat data akses.");
    }
  };

  // Event handlers
  const handleCredentialAnswer = () => {
    // Navigate to the Credential Answer page for Nakes and Mitra Bersari
    const route = `/Dashboard/Detail_Status/Kredensial_Answer`;
    router.push(route);
  };

  const handleCredentialReview = () => {
    // Navigate to the Credential Review page for Supervisor, Head_of_Installation, Committe
    const route = `/Dashboard/Detail_Status/Kredensial_Review`;
    router.push(route);
  };

  //------------------------------------------------UI Components
  const InfoCard = ({
    title,
    children,
    className = "",
  }: {
    title?: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`p-4 rounded-lg border shadow-sm ${className}`}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );

  const GridItem = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <>
      <div className="font-medium text-gray-700">{label}:</div>
      <div className="text-gray-900">{value}</div>
    </>
  );

  //--------------------------------------------------Display render
  //Nakes Info Card
  const renderNakesInfo = () => (
    <InfoCard className="bg-blue-50 border-blue-200">
      <div className="grid grid-cols-2 gap-3">
        <GridItem label="NIP" value={appDetail?.create_nip} />
        <GridItem label="Nama" value={appDetail?.create_name} />
      </div>
    </InfoCard>
  );

  // ============== STAGE 1: Supervisor Approval ==============
  const renderSupervisorApprovalStatus = () => {
    return (
      <InfoCard className={STATUS_COLORS.PENDING}>
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          <div className="text-center font-bold">
            Pengajuan Belum Disetujui Oleh Penanggung Jawab Ruangan{" "}
            {appDetail?.nakes_unit_name}
          </div>
        </div>
      </InfoCard>
    );
  };

  const renderSupervisorContent = () => (
    <InfoCard className="bg-gray-50">
      <p className="text-gray-600 text-xl mb-4">
        Anda memiliki akses sebagai Penanggung Jawab Pelayanan{" "}
        {appDetail?.nakes_unit_name}
        <br /> untuk meninjau dan menyetujui pengajuan Aplikasi Kredential ini
      </p>
      <Button
        className="bg-purple-500 hover:bg-purple-600 text-white text-center font-bold w-44 hover:cursor-pointer"
        onClick={handleCredentialReview}
      >
        REVIEW
      </Button>
    </InfoCard>
  );

  // ============== STAGE 2: Head of Installation Approval ==============
  const renderHeadofInstalationApprovalStatus = () => {
    return (
      <InfoCard className={STATUS_COLORS.PENDING}>
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          <div className="text-center font-bold">
            Pengajuan Belum Disetujui Oleh Kepala Instalasi
          </div>
        </div>
      </InfoCard>
    );
  };

  const renderHeadofInstalationContent = () => (
    <InfoCard className="bg-gray-50">
      <p className="text-gray-600 text-xl mb-4">
        Anda memiliki akses sebagai Kepala Instalasi
        <br /> untuk meninjau dan menyetujui pengajuan Aplikasi Kredential ini
      </p>
      <Button
        className="bg-purple-500 hover:bg-purple-600 text-white text-center font-bold w-44 hover:cursor-pointer"
        onClick={handleCredentialReview}
      >
        REVIEW
      </Button>
    </InfoCard>
  );

  // Show approval status (both Supervisor and Head of Installation approved)
  const renderApprovalStatus = () => {
    return (
      <InfoCard className={STATUS_COLORS.SUCCESS}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {appDetail?.supervisor_status === 3 ? (
            <GridItem label="PJ Ruangan" value="Menolak" />
          ) : (
            <>
              <GridItem label="PJ Ruangan" value={appDetail?.supervisor_name} />
              {!isNakes() && (
                <GridItem
                  label="Catatan"
                  value={appDetail?.supervisor_note || "-"}
                />
              )}
            </>
          )}

          {appDetail?.head_of_installation_status === 3 ? (
            <GridItem label="Kepala Instalasi" value="Menolak" />
          ) : (
            <>
              <GridItem
                label="Kepala Instalasi"
                value={appDetail?.head_of_installation_name}
              />
              {!isNakes() && (
                <GridItem
                  label="Catatan"
                  value={appDetail?.head_of_installation_note || "-"}
                />
              )}
            </>
          )}
        </div>
      </InfoCard>
    );
  };

  // ============== STAGE 3: Nakes Self-Evaluation (FIRST EVALUATION) ==============
  const renderNakesEvaluationSection = () => (
    <InfoCard className="bg-purple-50 border-purple-200">
      <div className="text-center mb-4">
        <div className="text-lg font-bold text-purple-700 mb-2">
          📋 Tahap Evaluasi Diri (Self-Assessment)
        </div>
        <p className="text-sm text-gray-600">
          Nakes melakukan penilaian kredential terhadap diri sendiri
        </p>
      </div>
      {isNakes() && (
        <div className="flex justify-center">
          <Button
            className="bg-purple-500 hover:bg-purple-600 hover:cursor-pointer text-white font-bold w-72"
            onClick={handleCredentialAnswer}
          >
            PENILAIAN KREDENTIAL
          </Button>
        </div>
      )}
      {!isNakes() && (
        <div className="text-center text-amber-600 font-semibold flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          Menunggu Nakes menyelesaikan evaluasi diri
        </div>
      )}
    </InfoCard>
  );

  // ============== STAGE 4: Mitra Bersari Evaluation (SECOND EVALUATION) ==============
  const renderNakesEvaluationComplete = () => (
    <InfoCard className="bg-green-100 text-green-700 border-green-300">
      <div className="mb-2">
        <div className="flex items-center gap-2 font-bold text-green-700">
          <CheckCircle className="w-5 h-5" />
          Evaluasi Diri Selesai
        </div>
        <div className="text-sm mt-1">
          Nakes telah menyelesaikan self-assessment
        </div>
      </div>
    </InfoCard>
  );

  const renderMitraBersariEvaluation = () => (
    <InfoCard className="bg-purple-50 border-purple-200">
      <div className="text-center mb-4">
        <div className="text-lg font-bold text-purple-700 mb-2">
          👥 Tahap Evaluasi Sejawat (Peer Review)
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Mitra Bersari melakukan penilaian kredential
        </p>
      </div>

      {!isNakes() && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <GridItem
            label="Mitrabersari 1"
            value={appDetail?.mitrabersari1_name || "-"}
          />
          <GridItem
            label="Mitrabersari 2"
            value={appDetail?.mitrabersari2_name || "-"}
          />
          <GridItem
            label="Mitrabersari 3"
            value={appDetail?.mitrabersari3_name || "-"}
          />
        </div>
      )}

      {isMitraBersari() && (
        <div className="flex justify-center">
          <Button
            className="bg-purple-500 hover:bg-purple-600 hover:cursor-pointer text-white font-bold w-72"
            onClick={handleCredentialAnswer}
          >
            PENILAIAN KREDENTIAL
          </Button>
        </div>
      )}

      {!isMitraBersari() && (
        <div className="text-center text-amber-600 font-semibold flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          Menunggu evaluasi dari Mitra Bersari
        </div>
      )}
    </InfoCard>
  );

  // ============== STAGE 5: Vice Committee Review ==============
  const renderViceCommitteeSection = () => (
    <>
      <InfoCard className="bg-green-100 text-green-700 border-green-300">
        <div className="mb-3">
          <div className="flex items-center gap-2 font-bold text-green-700 mb-2">
            <CheckCircle className="w-5 h-5" />
            Evaluasi Selesai
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">✓ Self-Assessment:</div>
          <div>Selesai (Nakes)</div>
          <div className="font-medium">✓ Peer Review:</div>
          {appDetail?.mitrabersari3_nip ? (
            <div>Selesai (3 Mitra Bersari)</div>
          ) : appDetail?.mitrabersari2_nip ? (
            <div>Selesai (2 Mitra Bersari)</div>
          ) : appDetail?.mitrabersari1_nip ? (
            <div>Selesai (1 Mitra Bersari)</div>
          ) : null}
        </div>
      </InfoCard>

      {!isNakes() && (
        <InfoCard className="bg-blue-50 border-blue-200">
          <div className="text-sm font-semibold mb-2">Evaluator:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <GridItem
              label="Mitrabersari 1"
              value={appDetail?.mitrabersari1_name || "-"}
            />
            <GridItem
              label="Mitrabersari 2"
              value={appDetail?.mitrabersari2_name || "-"}
            />
            <GridItem
              label="Mitrabersari 3"
              value={appDetail?.mitrabersari3_name || "-"}
            />
            <GridItem
              label="Mitrabersari Status"
              value={
                appDetail?.mitrabersari_status === 1 ||
                appDetail?.mitrabersari_status === 2 ? (
                  <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                    DITERIMA
                  </div>
                ) : (
                  <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                    DITOLAK
                  </div>
                )
              }
            />
            <GridItem
              label="Mitrabersari Note"
              value={appDetail?.mitrabersari_note || "-"}
            />
          </div>
        </InfoCard>
      )}

      <InfoCard className="bg-purple-50 border-purple-200">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-purple-700 mb-2">
            ⚖️ Tahap Review Komite (Final Review)
          </div>
          <p className="text-sm text-gray-600">
            Komite bagian Kredensial melakukan review akhir
          </p>
        </div>

        {isCommitte() && (
          <div className="flex justify-center">
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white text-center font-bold w-44 hover:cursor-pointer"
              onClick={handleCredentialReview}
            >
              REVIEW
            </Button>
          </div>
        )}

        {!isCommitte() && (
          <div className="text-center text-amber-600 font-semibold flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            Menunggu review akhir dari Komite
          </div>
        )}
      </InfoCard>
    </>
  );

  // ============== STAGE 6/8: Final Result ==============
  const renderFinalResultStatus = () => {
    if (appDetail?.status_app === 6) {
      return (
        <InfoCard className="bg-green-100 text-green-700 border-green-300">
          <div className="text-center mb-4">
            <CheckCircle className="w-16 h-16 mx-auto mb-2 text-green-600" />
            <h3 className="text-2xl font-bold text-green-700">
              {appDetail?.status_name}
            </h3>
            <p className="text-sm mt-2">Aplikasi kredensial telah disetujui</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="font-medium">Status Akhir:</div>
            <div className="bg-green-500 text-white font-bold px-4 py-1 rounded text-center">
              LOLOS
            </div>
            {!isNakes() && (
              <>
                <div className="font-medium">Catatan Komite:</div>
                <div>
                  {appDetail?.vice_committe_note ||
                    "Memenuhi semua persyaratan kredensial"}
                </div>
              </>
            )}
          </div>

          {!isNakes() && (
            <InfoCard className="bg-blue-50 border-blue-200 mt-4">
              <div className="text-sm">
                <div className="font-bold mb-2">Ringkasan Proses:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    ✓ Persetujuan Penangung Jawab{" "}
                    {appDetail?.supervisor_name || "-"}
                    {appDetail?.supervisor_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-4 mb-2">
                    Catatan : {appDetail?.supervisor_note || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    ✓ Persetujuan Kepala Instalasi{" "}
                    {appDetail?.head_of_installation_name || "-"}
                    {appDetail?.head_of_installation_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-4 mb-2">
                    Catatan : {appDetail?.head_of_installation_note || "-"}
                  </div>
                  <div>✓ Evaluasi Diri (Nakes)</div>
                  <div>✓ Evaluasi Sejawat (3 Mitra Bersari)</div>
                  <div className="ml-4">
                    Mitrabersari 1 {appDetail?.mitrabersari1_name || "-"}
                  </div>
                  <div className="ml-4">
                    Mitrabersari 2 {appDetail?.mitrabersari2_name || "-"}
                  </div>
                  <div className="ml-4">
                    Mitrabersari 3 {appDetail?.mitrabersari3_name || "-"}
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    Status Mitrabersari
                    {appDetail?.head_of_installation_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-4 mb-2">
                    Catatan : {appDetail?.mitrabersari_note || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    ✓ Persetujuan Komite Kredensial{" "}
                    {appDetail?.vice_committe_name || "-"}
                    {appDetail?.vice_committe_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-4 mb-2">
                    Catatan : {appDetail?.vice_committe_note || "-"}
                  </div>
                </div>
              </div>
            </InfoCard>
          )}
        </InfoCard>
      );
    } else if (appDetail?.status_app === 8) {
      return (
        <InfoCard className="bg-red-100 text-red-700 border-red-300">
          <div className="text-center mb-4">
            <XCircle className="w-16 h-16 mx-auto mb-2 text-red-600" />
            <h3 className="text-2xl font-bold text-red-700">
              {appDetail?.status_name}
            </h3>
            <p className="text-sm mt-2">Aplikasi kredensial tidak disetujui</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="font-medium">Status Akhir:</div>
            <div className="bg-red-500 text-white font-bold px-4 py-1 rounded text-center">
              GAGAL
            </div>
            {!isNakes() && (
              <>
                <div className="font-medium">Alasan:</div>
                <div>
                  {appDetail?.vice_committe_note ||
                    appDetail?.mitrabersari_note ||
                    appDetail?.head_of_installation_note ||
                    appDetail?.supervisor_note ||
                    "Tidak memenuhi persyaratan kredensial"}
                </div>
              </>
            )}
          </div>
          {!isNakes() && (
            <InfoCard className="bg-red-100 border-red-700 mt-4">
              <div className="text-sm">
                <div className="font-bold mb-2">Ringkasan Proses:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    - Persetujuan Penangung Jawab{" "}
                    {appDetail?.supervisor_name || "-"}
                    {appDetail?.supervisor_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-2 mb-2">
                    Catatan : {appDetail?.supervisor_note || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    - Persetujuan Kepala Instalasi{" "}
                    {appDetail?.head_of_installation_name || "-"}
                    {appDetail?.head_of_installation_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-2 mb-2">
                    Catatan : {appDetail?.head_of_installation_note || "-"}
                  </div>
                  <div>- Evaluasi Diri (Nakes)</div>
                  <div>- Evaluasi Sejawat (3 Mitra Bersari)</div>
                  <div className="ml-2">
                    Mitrabersari 1 {appDetail?.mitrabersari1_name || "-"}
                  </div>
                  <div className="ml-2">
                    Mitrabersari 2 {appDetail?.mitrabersari2_name || "-"}
                  </div>
                  <div className="ml-2">
                    Mitrabersari 3 {appDetail?.mitrabersari3_name || "-"}
                  </div>
                  <div className="ml-2 flex items-center gap-2">
                    Status Mitrabersari
                    {appDetail?.head_of_installation_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-2 mb-2">
                    Catatan : {appDetail?.mitrabersari_note || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    - Persetujuan Komite Kredensial{" "}
                    {appDetail?.vice_committe_name || "-"}
                    {appDetail?.vice_committe_status === 1 ? (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-green-500">
                        DITERIMA
                      </div>
                    ) : (
                      <div className="rounded-lg p-1 text-center font-bold text-white text-xs w-20 bg-red-500">
                        DITOLAK
                      </div>
                    )}
                  </div>
                  <div className="ml-2 mb-2">
                    Catatan : {appDetail?.vice_committe_note || "-"}
                  </div>
                </div>
              </div>
            </InfoCard>
          )}
        </InfoCard>
      );
    }
    return null;
  };

  //---------------------------------------------------------------Main Content Renderer
  const renderMainContent = () => {
    return (
      <div className="space-y-6">
        {/* Stage 1: Supervisor Approval */}
        {approveBySupervisor_Yet() && (
          <>
            {renderSupervisorApprovalStatus()}
            {isSupervisor() && renderSupervisorContent()}
          </>
        )}

        {/* Stage 2: Head of Installation Approval */}
        {approveByHeadOfInstallation_Yet() && (
          <>
            {renderApprovalStatus()} {/* Show Supervisor approved */}
            {renderHeadofInstalationApprovalStatus()}
            {isHead_of_Installation() && renderHeadofInstalationContent()}
          </>
        )}

        {/* Stage 3: Nakes Self-Evaluation (FIRST EVALUATION) */}
        {evaluationOfNakes_Yet() && (
          <>
            {renderApprovalStatus()} {/* Show both approvals complete */}
            {renderNakesEvaluationSection()}
          </>
        )}

        {/* Stage 4: Mitra Bersari Evaluation (SECOND EVALUATION) */}
        {evaluationOfMitrabersari_Yet() && (
          <>
            {renderApprovalStatus()} {/* Show both approvals complete */}
            {renderNakesEvaluationComplete()} {/* Show Nakes is done */}
            {renderMitraBersariEvaluation()}
          </>
        )}

        {/* Stage 5: Vice Committee Review */}
        {approveByViceCommitte_Yet() && (
          <>
            {renderApprovalStatus()}
            {renderViceCommitteeSection()}
          </>
        )}

        {/* Stage 6/8: Final Result */}
        {finalResult() && renderFinalResultStatus()}
      </div>
    );
  };

  //--------------------------------------------------------Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              Detail Aplikasi
            </h1>

            <div className="bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-xl inline-block mb-2">
              {appDetail?.short_name}
            </div>

            <div className="text-blue-600 text-xl font-medium">
              {appDetail?.name_document}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {renderNakesInfo()}
            {renderMainContent()}
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-white rounded-lg border text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <div>
                Diajukan pertama kali:{" "}
                {toDBTime(appDetail?.create_date || null)}
              </div>
              <div>Masuk sebagai: {access}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
