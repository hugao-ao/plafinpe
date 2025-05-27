import React from 'react';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { useDiagnostico } from '../../context/DiagnosticoContext';

const COLORS = ['#e6c860', '#d4af37', '#a98c2c', '#7e6921', '#544616', '#2a230b', '#006d4e', '#00513a'];

const PlanejamentoDashboard: React.FC = () => {
  const { diagnostico, planejamento, indicadores, avancarEtapa } = useDiagnostico();
  
  if (!planejamento) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  // Dados para gráfico de alocação recomendada
  const alocacaoData = planejamento.investimentos.alocacaoRecomendada.map(item => ({
    name: item.categoria,
    value: item.percentual
  }));

  // Dados para gráfico de projeção de acumulação
  const projecaoData = planejamento.investimentos.projecaoAcumulacao;

  // Dados para gráfico de plano de quitação de dívidas
  const dividasData = planejamento.organizacaoFinanceira.planoQuitacaoDividas.ordemQuitacao.map((divida, index) => ({
    name: divida.descricao,
    valor: divida.valorTotal,
    juros: divida.taxaJuros,
    ordem: index + 1
  }));

  // Calcular totais para resumo
  const totalReceitas = diagnostico.fontesRenda.reduce((sum, fonte) => sum + fonte.valor, 0);
  const totalDespesas = diagnostico.despesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  const saldoMensal = totalReceitas - totalDespesas;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gold-400">Planejamento Financeiro</h1>
      
      {diagnostico.dadosPessoais.nome && (
        <p className="text-xl text-center mb-8 text-gold-300">
          Planejamento de {diagnostico.dadosPessoais.nome}, {diagnostico.dadosPessoais.idade} anos
        </p>
      )}
      
      {/* Resumo do Planejamento */}
      <div className="card mb-8">
        <h2 className="section-title">Resumo do Planejamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-emerald-800/50 p-4 rounded-lg border border-gold-500/20">
            <h3 className="text-lg font-semibold text-gold-400 mb-2">Perfil de Investidor</h3>
            <p className="text-gold-300 font-medium text-xl capitalize">{planejamento.investimentos.perfilRecomendado}</p>
            <p className="text-sm text-gold-300/70 mt-2">
              Baseado na sua idade, objetivos e situação financeira atual.
            </p>
          </div>
          
          <div className="bg-emerald-800/50 p-4 rounded-lg border border-gold-500/20">
            <h3 className="text-lg font-semibold text-gold-400 mb-2">Reserva de Emergência</h3>
            <p className="text-gold-300 font-medium text-xl">
              R$ {planejamento.reservaEmergencia.valorIdeal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gold-300/70 mt-2">
              {planejamento.reservaEmergencia.planoConstituicao.tempoEstimadoMeses} meses para constituição
            </p>
          </div>
          
          <div className="bg-emerald-800/50 p-4 rounded-lg border border-gold-500/20">
            <h3 className="text-lg font-semibold text-gold-400 mb-2">Aposentadoria</h3>
            <p className="text-gold-300 font-medium text-xl">
              {planejamento.aposentadoria.idadeEstimada} anos
            </p>
            <p className="text-sm text-gold-300/70 mt-2">
              Renda mensal estimada: R$ {planejamento.aposentadoria.valorNecessarioMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Organização Financeira */}
      <div className="card mb-8">
        <h2 className="section-title">Organização Financeira</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="subsection-title">Recomendações</h3>
            <ul className="space-y-2">
              {planejamento.organizacaoFinanceira.recomendacoes.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gold-500/20 text-gold-300 mr-2">
                    {index + 1}
                  </span>
                  <span className="text-gold-300/90">{rec}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="subsection-title mt-6">Estratégias para Redução de Despesas</h3>
            <ul className="space-y-2">
              {planejamento.organizacaoFinanceira.estrategiasReducaoDespesas.map((est, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-700/50 text-gold-300 mr-2">
                    {index + 1}
                  </span>
                  <span className="text-gold-300/90">{est}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="subsection-title">Plano de Quitação de Dívidas</h3>
            <p className="mb-4 text-gold-300/90">
              Estratégia recomendada: <span className="font-medium capitalize text-gold-300">
                {planejamento.organizacaoFinanceira.planoQuitacaoDividas.estrategia === 'avalanche' 
                  ? 'Avalanche (maiores juros primeiro)' 
                  : 'Bola de Neve (menores valores primeiro)'}
              </span>
            </p>
            
            {dividasData.length > 0 ? (
              <>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dividasData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#00513a" />
                      <XAxis dataKey="name" stroke="#d4af37" />
                      <YAxis stroke="#d4af37" />
                      <Tooltip 
                        formatter={(value, name) => [
                          `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                          name === 'juros' ? 'Taxa de Juros' : 'Valor'
                        ]}
                        contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                        labelStyle={{ color: '#d4af37' }}
                        itemStyle={{ color: '#d4af37' }}
                      />
                      <Legend wrapperStyle={{ color: '#d4af37' }} />
                      <Bar dataKey="valor" name="Valor (R$)" fill="#d4af37" />
                      <Bar dataKey="juros" name="Taxa de Juros (%)" fill="#00513a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <p className="text-sm text-gold-300/70">
                  Tempo estimado para quitação: <span className="font-medium text-gold-300">
                    {planejamento.organizacaoFinanceira.planoQuitacaoDividas.tempoEstimadoMeses} meses
                  </span>
                </p>
              </>
            ) : (
              <p className="text-center py-8 text-gold-300/70">Nenhuma dívida cadastrada</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Investimentos */}
      <div className="card mb-8">
        <h2 className="section-title">Estratégia de Investimentos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="subsection-title">Alocação Recomendada</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alocacaoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {alocacaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                    labelStyle={{ color: '#d4af37' }}
                    itemStyle={{ color: '#d4af37' }}
                  />
                  <Legend wrapperStyle={{ color: '#d4af37' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="subsection-title">Projeção de Acumulação</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projecaoData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#00513a" />
                  <XAxis dataKey="tempo" label={{ value: 'Anos', position: 'insideBottomRight', offset: 0 }} stroke="#d4af37" />
                  <YAxis 
                    tickFormatter={(value) => value >= 1000000 
                      ? `${(value / 1000000).toFixed(1)}M` 
                      : `${(value / 1000).toFixed(0)}K`
                    } 
                    stroke="#d4af37"
                  />
                  <Tooltip 
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    labelFormatter={(value) => `${value} anos`}
                    contentStyle={{ backgroundColor: '#003c2b', border: '1px solid #00513a', borderRadius: '8px' }}
                    labelStyle={{ color: '#d4af37' }}
                    itemStyle={{ color: '#d4af37' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#d4af37" fill="#d4af37" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-gold-300">Exemplos de Investimentos Recomendados:</h4>
              {planejamento.investimentos.alocacaoRecomendada.map((categoria, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium text-gold-300">{categoria.categoria} ({categoria.percentual}%)</p>
                  <p className="text-sm text-gold-300/70">{categoria.exemplos.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Proteção Patrimonial */}
      <div className="card mb-8">
        <h2 className="section-title">Proteção Patrimonial</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-700">
            <thead className="bg-emerald-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider">
                  Tipo de Seguro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider">
                  Cobertura Recomendada
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider">
                  Valor Estimado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider">
                  Prioridade
                </th>
              </tr>
            </thead>
            <tbody className="bg-emerald-800/20 divide-y divide-emerald-700/30">
              {planejamento.protecaoPatrimonial.segurosRecomendados.map((seguro, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gold-300">{seguro.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gold-300/90">
                      R$ {seguro.coberturaRecomendada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gold-300/90">
                      R$ {seguro.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${seguro.prioridade === 'alta' ? 'bg-red-900/50 text-red-300' : 
                        seguro.prioridade === 'media' ? 'bg-yellow-900/50 text-yellow-300' : 
                        'bg-emerald-900/50 text-emerald-300'}`}>
                      {seguro.prioridade === 'alta' ? 'Alta' : 
                        seguro.prioridade === 'media' ? 'Média' : 'Baixa'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Aposentadoria */}
      <div className="card mb-8">
        <h2 className="section-title">Planejamento para Aposentadoria</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-emerald-800/40 p-4 rounded-lg mb-6 border border-gold-500/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gold-300/70">Idade Estimada</p>
                  <p className="text-xl font-semibold text-gold-300">{planejamento.aposentadoria.idadeEstimada} anos</p>
                </div>
                <div>
                  <p className="text-sm text-gold-300/70">Renda Mensal Necessária</p>
                  <p className="text-xl font-semibold text-gold-300">
                    R$ {planejamento.aposentadoria.valorNecessarioMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gold-300/70">Valor Total Necessário</p>
                  <p className="text-xl font-semibold text-gold-300">
                    R$ {planejamento.aposentadoria.valorTotalNecessario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gold-300/70">Tempo de Acumulação</p>
                  <p className="text-xl font-semibold text-gold-300">
                    {planejamento.aposentadoria.planoAcumulacao.tempoAcumulacaoAnos} anos
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="subsection-title">Plano de Acumulação</h3>
            <p className="mb-4 text-gold-300/90">
              Para atingir sua meta de aposentadoria, você precisará investir mensalmen
(Content truncated due to size limit. Use line ranges to read in chunks)
