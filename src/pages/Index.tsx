import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

interface SCPObject {
  id: string;
  name: string;
  class: "Safe" | "Euclid" | "Keter" | "Thaumiel" | "Apollyon";
  description: string;
  containment: string;
  threat: number;
  clearance: number;
}

interface Story {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  clearance: number;
}

interface MapBuilding {
  id: string;
  name: string;
  type: "main" | "lab" | "containment" | "anomaly" | "research";
  status: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

const Index = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [clearanceLevel, setClearanceLevel] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSCP, setSelectedSCP] = useState<SCPObject | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [glitchText, setGlitchText] = useState(false);
  const [containmentBreach, setContainmentBreach] = useState(false);
  const [systemMalfunction, setSystemMalfunction] = useState(false);
  const [powerFlicker, setPowerFlicker] = useState(false);
  const [radioStatic, setRadioStatic] = useState(false);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const scpObjects: SCPObject[] = [
    {
      id: "SCP-109-1",
      name: "Временная Петля",
      class: "Euclid",
      description:
        "Участок территории размером 50x50 метров, в котором время течет циклически. Каждые 4 часа 17 минут события сбрасываются.",
      containment:
        "Территория огорожена электрифицированным забором. Доступ только для персонала уровня 3+.",
      threat: 6,
      clearance: 3,
    },
    {
      id: "SCP-109-2",
      name: "Шепчущие Тени",
      class: "Keter",
      description:
        "Теневые сущности, способные влиять на психическое состояние персонала. Проявляются в виде движущихся теней без источника.",
      containment:
        "Территория освещается мощными прожекторами 24/7. Персонал работает в парах.",
      threat: 9,
      clearance: 4,
    },
    {
      id: "SCP-109-3",
      name: "Квантовые Двери",
      class: "Safe",
      description:
        "Три деревянные двери, ведущие в произвольные локации по всему миру. Активируются при касании.",
      containment:
        "Двери заперты на замки уровня 5. Используются только для особых операций.",
      threat: 3,
      clearance: 2,
    },
    {
      id: "SCP-109-4",
      name: "Мемориальная Плита",
      class: "Apollyon",
      description:
        "[ДАННЫЕ УДАЛЕНЫ] Высокоприоритетная угроза для всего человечества. Детали засекречены.",
      containment: "Уровень X. Только О5-Совет.",
      threat: 10,
      clearance: 5,
    },
  ];

  const facilities = [
    { name: "Главный Корпус", status: "Безопасно", x: 45, y: 30 },
    { name: "Лаборатория А", status: "Ограниченный доступ", x: 20, y: 60 },
    { name: "Блок Содержания", status: "Нарушение", x: 70, y: 80 },
    { name: "Временная Аномалия", status: "Активна", x: 60, y: 20 },
    { name: "Шахта Исследований", status: "Неизвестно", x: 80, y: 50 },
  ];

  const handleAuth = () => {
    if (username && password) {
      const level = Math.floor(Math.random() * 6);
      setClearanceLevel(level);
      setIsAuthorized(true);
      setUsername("");
      setPassword("");
    }
  };

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 200);
      },
      5000 + Math.random() * 10000,
    );

    const breachInterval = setInterval(
      () => {
        setContainmentBreach(true);
        setTimeout(() => setContainmentBreach(false), 3000);
      },
      30000 + Math.random() * 60000,
    );

    return () => {
      clearInterval(glitchInterval);
      clearInterval(breachInterval);
    };
  }, []);

  const getClassColor = (objClass: string) => {
    switch (objClass) {
      case "Safe":
        return "bg-green-900 text-green-100";
      case "Euclid":
        return "bg-yellow-900 text-yellow-100";
      case "Keter":
        return "bg-red-900 text-red-100";
      case "Thaumiel":
        return "bg-blue-900 text-blue-100";
      case "Apollyon":
        return "bg-purple-900 text-purple-100";
      default:
        return "bg-gray-900 text-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Безопасно":
        return "bg-green-500";
      case "Ограниченный доступ":
        return "bg-yellow-500";
      case "Нарушение":
        return "bg-red-500";
      case "Активна":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-green-700 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Icon name="Shield" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${glitchText ? "animate-pulse text-red-400" : "text-green-400"}`}
                >
                  УЧАСТОК-109
                </h1>
                <p className="text-sm text-gray-400">
                  ФОНД SCP • СЕКРЕТНАЯ ИССЛЕДОВАТЕЛЬСКАЯ БАЗА
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthorized ? (
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${clearanceLevel >= 3 ? "bg-green-600" : "bg-yellow-600"}`}
                  >
                    УРОВЕНЬ {clearanceLevel}
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => setIsAuthorized(false)}
                    className="text-green-400 border-green-700 hover:bg-green-900"
                  >
                    ВЫХОД
                  </Button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      АВТОРИЗАЦИЯ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-green-700">
                    <DialogHeader>
                      <DialogTitle className="text-green-400">
                        ДОСТУП К БАЗЕ ДАННЫХ
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="ID ПЕРСОНАЛА"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-800 border-green-700 text-green-400"
                      />
                      <Input
                        type="password"
                        placeholder="КОД ДОСТУПА"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-green-700 text-green-400"
                      />
                      <Button
                        onClick={handleAuth}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        АВТОРИЗАЦИЯ
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert System */}
      {containmentBreach && (
        <Alert className="border-red-600 bg-red-900/20 animate-pulse">
          <Icon name="AlertTriangle" className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            <strong>ВНИМАНИЕ!</strong> Зафиксировано нарушение протокола
            содержания в секторе Gamma-7. Все сотрудники должны следовать
            процедуре эвакуации.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-green-700">
            <TabsTrigger
              value="overview"
              className="text-green-400 data-[state=active]:bg-green-900"
            >
              ОБЗОР
            </TabsTrigger>
            <TabsTrigger
              value="scp"
              className="text-green-400 data-[state=active]:bg-green-900"
            >
              SCP-ОБЪЕКТЫ
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="text-green-400 data-[state=active]:bg-green-900"
            >
              КАРТА
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="text-green-400 data-[state=active]:bg-green-900"
            >
              ОТЧЕТЫ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-800 border-green-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Icon name="Users" className="w-5 h-5 mr-2" />
                    ПЕРСОНАЛ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Активный:</span>
                      <span className="text-green-400">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Недоступен:</span>
                      <span className="text-red-400">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Класс D:</span>
                      <span className="text-yellow-400">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-green-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Icon name="AlertTriangle" className="w-5 h-5 mr-2" />
                    УГРОЗЫ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Активные:</span>
                      <span className="text-red-400">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Содержание:</span>
                      <span className="text-yellow-400">Нарушено</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Уровень:</span>
                      <span className="text-red-400">ВЫСОКИЙ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-green-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Icon name="Activity" className="w-5 h-5 mr-2" />
                    СИСТЕМЫ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Мощность:</span>
                      <span className="text-green-400">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Безопасность:</span>
                      <span className="text-yellow-400">Средняя</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Связь:</span>
                      <span className="text-green-400">Активна</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-green-700">
              <CardHeader>
                <CardTitle className="text-green-400">
                  ПОСЛЕДНИЕ СОБЫТИЯ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">
                      23:47 - Нарушение содержания SCP-109-2
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      22:15 - Активация временной петли SCP-109-1
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      21:03 - Плановое техническое обслуживание завершено
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scp" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {scpObjects.map((scp) => (
                <Card
                  key={scp.id}
                  className="bg-gray-800 border-green-700 hover:border-green-500 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-400">{scp.id}</CardTitle>
                      <Badge className={getClassColor(scp.class)}>
                        {scp.class}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{scp.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-300">
                          {clearanceLevel >= scp.clearance
                            ? scp.description
                            : "[ТРЕБУЕТСЯ ПОВЫШЕННЫЙ УРОВЕНЬ ДОСТУПА]"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Icon
                            name="Shield"
                            className="w-4 h-4 text-red-400"
                          />
                          <span className="text-sm text-gray-400">Угроза:</span>
                          <Progress
                            value={scp.threat * 10}
                            className="w-16 h-2"
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon
                            name="Key"
                            className="w-4 h-4 text-yellow-400"
                          />
                          <span className="text-sm text-gray-400">
                            Уровень {scp.clearance}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSCP(scp)}
                        disabled={clearanceLevel < scp.clearance}
                        className="w-full text-green-400 border-green-700 hover:bg-green-900"
                      >
                        {clearanceLevel >= scp.clearance
                          ? "ПОДРОБНЕЕ"
                          : "ДОСТУП ЗАПРЕЩЕН"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="bg-gray-800 border-green-700">
              <CardHeader>
                <CardTitle className="text-green-400">
                  ИНТЕРАКТИВНАЯ КАРТА УЧАСТКА-109
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg p-4 h-96 border border-green-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-red-900/20 rounded-lg"></div>
                  {facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${facility.x}%`, top: `${facility.y}%` }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${getStatusColor(facility.status)} animate-pulse`}
                      ></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-green-400 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <div className="font-bold">{facility.name}</div>
                        <div className="text-gray-400">{facility.status}</div>
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Безопасно</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Ограничено</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Нарушение</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-gray-800 border-green-700">
              <CardHeader>
                <CardTitle className="text-green-400">
                  ЗАСЕКРЕЧЕННЫЕ ОТЧЕТЫ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Отчет о происшествии #109-A",
                      date: "2024-01-15",
                      level: 3,
                      status: "Засекречено",
                    },
                    {
                      title: "Эксперимент с SCP-109-1",
                      date: "2024-01-10",
                      level: 2,
                      status: "Завершен",
                    },
                    {
                      title: "Анализ аномальной активности",
                      date: "2024-01-08",
                      level: 4,
                      status: "В процессе",
                    },
                    {
                      title: "Протокол содержания SCP-109-4",
                      date: "2024-01-01",
                      level: 5,
                      status: "Критический",
                    },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-900 rounded border border-green-700"
                    >
                      <div className="flex-1">
                        <h4 className="text-green-400 font-medium">
                          {clearanceLevel >= report.level
                            ? report.title
                            : "[ДАННЫЕ УДАЛЕНЫ]"}
                        </h4>
                        <p className="text-sm text-gray-400">{report.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-yellow-400 border-yellow-700"
                        >
                          Уровень {report.level}
                        </Badge>
                        <Badge
                          className={
                            report.status === "Критический"
                              ? "bg-red-600"
                              : "bg-gray-600"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* SCP Detail Modal */}
      {selectedSCP && (
        <Dialog open={!!selectedSCP} onOpenChange={() => setSelectedSCP(null)}>
          <DialogContent className="bg-gray-900 border-green-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-green-400 flex items-center justify-between">
                <span>
                  {selectedSCP.id}: {selectedSCP.name}
                </span>
                <Badge className={getClassColor(selectedSCP.class)}>
                  {selectedSCP.class}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-green-400 font-medium mb-2">ОПИСАНИЕ:</h4>
                <p className="text-gray-300 text-sm">
                  {selectedSCP.description}
                </p>
              </div>
              <div>
                <h4 className="text-green-400 font-medium mb-2">
                  ПРОТОКОЛ СОДЕРЖАНИЯ:
                </h4>
                <p className="text-gray-300 text-sm">
                  {selectedSCP.containment}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-400">Уровень угрозы:</span>
                  <Progress
                    value={selectedSCP.threat * 10}
                    className="w-20 h-2"
                  />
                  <span className="text-sm text-red-400">
                    {selectedSCP.threat}/10
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <div className="border-t border-green-700 bg-black/90 mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              <p>
                © 2024 Фонд SCP • Участок-109 • Уровень секретности:
                КОСМИЧЕСКИЙ
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span>Система активна</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
