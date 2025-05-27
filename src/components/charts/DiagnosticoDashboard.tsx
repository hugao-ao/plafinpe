import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';
import { useDiagnostico } from '../../context/DiagnosticoContext';

const COLORS = ['#e6c860', '#d4af37', '#a98c2c', '#7e6921', '#544616', '#2a230b', '#006d4e', '#00513a'];

const DiagnosticoDashboard: React.FC = () => {
  const { diagnostico, indicadores, calcularIndicadores, gerarPlanejamento, avancarEtapa } = useDiagnostico();
  
  // Calcular indicadores se ainda não foram calculados
  React.useEffect(() => {
    if (!indicadores) {
      calcularIndicadores();
    }
  }, [indicadores, calcularIndicadores]);

  // Preparar dados para gráficos
  const dadosReceitas = diagnostico.fontesRenda.map(fonte => ({
    name: fonte.descricao,
    value: fonte.valor
  }));

  const totalReceitas = diagnostico.fontesRenda.reduce((sum, fonte) => sum + fonte.valor, 0);
  
  // Agrupar despesas por categoria
  const despesasPorCategoria = diagnostico.despesas.reduce((acc, despesa) => {
    const categoria = acc.find(item => item.name === despesa.categoria);
    if (categoria) {
      categoria.value += despesa.valor;
    } else {
      acc.push({
        name: despesa.categoria,
        value: despesa.valor
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const totalDespesas = diagnostico.despesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  
  // Dados para gráfico de fluxo de caixa
  const fluxoCaixa = [
    { name: 'Receitas', valor: totalReceitas },
    { name: 'Despesas', valor: totalDespesas },
    { name: 'Saldo', valor: totalReceitas - totalDespesas }
  ];

  // Dados para gráfico de patrimônio
  const patrimonioData = [
    {
      name: 'Bens',
      value: diagnostico.bensPatrimoniais.reduce((sum, bem) => sum + bem.valor, 0)
    },
    {
      name: 'Investimentos',
      value: diagnostico.investimentos.reduce((sum, inv) => sum + inv.valor, 0)
    },
    {
      name: 'Dívidas',
      value: diagnostico.dividas.reduce((sum, divida) => sum + divida.valorTotal, 0)
    }
  ];

  const patrimonioLiquido = patrimonioData[0].value + patrimonioData[1].value - patrimonioData[2].value;

  // Função para classificar indicadores com cores
  const getClassColor = (classificacao: string) => {
    switch (classificacao) {
      case 'Excelente': return 'bg-gold-400';
      case 'Bom': return 'bg-gold-300';
      case 'Regular': return 'bg-yellow-400';
      case 'Atenção': return 'bg-orange-500';
      case 'Crítico': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const handleGerarPlanejamento = () => {
    gerarPlanejamento();
    avancarEtapa();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gold-400">Diagnóstico Financeiro</h1>
      
      {diagnostico.dadosPessoais.nome && (
        <p className="text-xl text-center mb-8 text-gold-300">
          Diagnóstico de {diagnostico.dadosPessoais.nome}, {diagnostico.dadosPessoais.idade} anos
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Resumo Financeiro */}
        <div className="card">
          <h2 className="section-title">Resumo Financeiro</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gold-300/70">Receitas Mensais</p>
              <p className="text-xl font-semibold text-gold-400">R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gold-300/70">Despesas Mensais</p>
              <p className="text-xl font-semibold text-gold-400">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gold-300/70">Saldo Mensal</p>
              <p className={`text-xl font-semibold ${(totalReceitas - totalDespesas) >= 0 ? 'text-gold-400' : 'text-red-400'}`}>
                R$ {(totalReceitas - totalDespesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gold-300/70">Patrimônio Líquido</p>
              <p className={`text-xl font-semibold ${patrimonioLiquido >= 0 ? 'text-gold-400' : 'text-red-400'}`}>
                R$ {patrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          
          {/* Gráfico de Fluxo de Caixa */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fluxoCaixa}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#00513a" />
                <XAxis dataKey="name" stroke="#d4af37" />
                <YAxis stroke="#d4af37" />
                <Tooltip 
                  formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                  labelStyle={{ color: '#d4af37' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Legend wrapperStyle={{ color: '#d4af37' }} />
                <Bar dataKey="valor" name="Valor (R$)">
                  {fluxoCaixa.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#d4af37' : index === 1 ? '#00513a' : entry.valor >= 0 ? '#d4af37' : '#00513a'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Indicadores Financeiros */}
        <div className="card">
          <h2 className="section-title">Indicadores Financeiros</h2>
          
          {indicadores ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gold-300">Índice de Endividamento</span>
                  <span className={`text-xs px-2 py-1 rounded-full text-emerald-900 ${getClassColor(indicadores.classificacaoEndividamento)}`}>
                    {indicadores.classificacaoEndividamento}
                  </span>
                </div>
                <div className="w-full bg-emerald-800 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getClassColor(indicadores.classificacaoEndividamento)}`} 
                    style={{ width: `${Math.min(indicadores.indiceEndividamento * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gold-300/70 mt-1">
                  {indicadores.indiceEndividamento.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 1 })} da renda anual
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gold-300">Índice de Liquidez</span>
                  <span className={`text-xs px-2 py-1 rounded-full text-emerald-900 ${getClassColor(indicadores.classificacaoLiquidez)}`}>
                    {indicadores.classificacaoLiquidez}
                  </span>
                </div>
                <div className="w-full bg-emerald-800 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getClassColor(indicadores.classificacaoLiquidez)}`} 
                    style={{ width: `${Math.min(indicadores.indiceLiquidez * 50, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gold-300/70 mt-1">
                  {indicadores.indiceLiquidez.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}x as despesas mensais
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gold-300">Taxa de Poupança</span>
                  <span className={`text-xs px-2 py-1 rounded-full text-emerald-900 ${getClassColor(indicadores.classificacaoPoupanca)}`}>
                    {indicadores.classificacaoPoupanca}
                  </span>
                </div>
                <div className="w-full bg-emerald-800 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getClassColor(indicadores.classificacaoPoupanca)}`} 
                    style={{ width: `${Math.min(indicadores.taxaPoupanca * 100 * 3, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gold-300/70 mt-1">
                  {indicadores.taxaPoupanca.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 1 })} da renda mensal
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gold-300">Cobertura de Seguros</span>
                  <span className={`text-xs px-2 py-1 rounded-full text-emerald-900 ${getClassColor(indicadores.classificacaoSeguros)}`}>
                    {indicadores.classificacaoSeguros}
                  </span>
                </div>
                <div className="w-full bg-emerald-800 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getClassColor(indicadores.classificacaoSeguros)}`} 
                    style={{ width: `${Math.min(indicadores.coberturaSeguros * 50, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gold-300/70 mt-1">
                  {indicadores.coberturaSeguros.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}x o patrimônio
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Composição de Receitas */}
        <div className="card">
          <h2 className="section-title">Composição de Receitas</h2>
          
          {dadosReceitas.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosReceitas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dadosReceitas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                    labelStyle={{ color: '#d4af37' }}
                    itemStyle={{ color: '#d4af37' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gold-300/70">Nenhuma receita cadastrada</p>
            </div>
          )}
        </div>
        
        {/* Composição de Despesas */}
        <div className="card">
          <h2 className="section-title">Composição de Despesas</h2>
          
          {despesasPorCategoria.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={despesasPorCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {despesasPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                    labelStyle={{ color: '#d4af37' }}
                    itemStyle={{ color: '#d4af37' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gold-300/70">Nenhuma despesa cadastrada</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Composição Patrimonial */}
        <div className="card">
          <h2 className="section-title">Composição Patrimonial</h2>
          
          {patrimonioData.some(item => item.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={patrimonioData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#00513a" />
                  <XAxis dataKey="name" stroke="#d4af37" />
                  <YAxis stroke="#d4af37" />
                  <Tooltip 
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                    labelStyle={{ color: '#d4af37' }}
                    itemStyle={{ color: '#d4af37' }}
                  />
                  <Legend wrapperStyle={{ color: '#d4af37' }} />
                  <Bar dataKey="value" name="Valor (R$)">
                    {patrimonioData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 2 ? '#00513a' : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gold-300/70">Nenhum patrimônio cadastrado</p>
            </div>
          )}
        </div>
        
        {/* Alertas e Recomendações */}
        <div className="card">
          <h2 className="section-title">Alertas e Pontos de Atenção</h2>
          
          <div className="space-y-4">
            {totalReceitas < totalDespesas && (
              <div className="p-3 bg-red-900/30
(Content truncated due to size limit. Use line ranges to read in chunks)
