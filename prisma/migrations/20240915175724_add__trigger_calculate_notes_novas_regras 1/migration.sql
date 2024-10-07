DROP TRIGGER IF EXISTS grades_update_trigger ON notes;

-- Função que será chamada pela trigger
CREATE OR REPLACE FUNCTION update_grades() RETURNS TRIGGER AS $$
DECLARE
  negative_count INT := 0;
BEGIN
  -- Arredondar os valores de pf1, pf2, pft, ps1, ps2, pst, pt1, pt2, ptt por excesso
  NEW.pf1 := CEIL(NEW.pf1);
  NEW.pf2 := CEIL(NEW.pf2);
  NEW.pft := CEIL(NEW.pft);

  NEW.ps1 := CEIL(NEW.ps1);
  NEW.ps2 := CEIL(NEW.ps2);
  NEW.pst := CEIL(NEW.pst);

  NEW.pt1 := CEIL(NEW.pt1);
  NEW.pt2 := CEIL(NEW.pt2);
  NEW.ptt := CEIL(NEW.ptt);

  NEW.ims := CEIL(NEW.ims);

  -- Inicialize todas as variáveis com valores padrão e arredondamento por excesso
  NEW.mt1 := 0;
  NEW.mt2 := 0;
  NEW.mt3 := 0;
  NEW.mfd := 0;
  NEW.mf := 0;

  -- Cálculo para o Iº trimestre (pf1, pf2, pft)
  IF NEW.pf1 IS NOT NULL AND NEW.pf2 IS NOT NULL AND NEW.pft IS NOT NULL THEN
    NEW.mt1 := CEIL((NEW.pf1 + NEW.pf2 + NEW.pft) / 3);  -- Arredondar por excesso
  END IF;

  -- Cálculo para o IIº trimestre (ps1, ps2, pst)
  IF NEW.ps1 IS NOT NULL AND NEW.ps2 IS NOT NULL AND NEW.pst IS NOT NULL THEN
    NEW.mt2 := CEIL((NEW.ps1 + NEW.ps2 + NEW.pst) / 3);  -- Arredondar por excesso
  END IF;

  -- Cálculo para o IIIº trimestre (pt1, pt2, ptt)
  IF NEW.pt1 IS NOT NULL AND NEW.pt2 IS NOT NULL AND NEW.ptt IS NOT NULL THEN
    IF NEW.level = 'CLASS_10' OR NEW.level = 'CLASS_11' THEN
      NEW.mt3 := CEIL((NEW.pt1 + NEW.pt2 + NEW.ptt) / 3);  -- Arredondar por excesso

      -- Calcular a média final da disciplina (mfd) e arredondar por excesso
      IF NEW.mt1 IS NOT NULL AND NEW.mt2 IS NOT NULL THEN
        NEW.mfd := CEIL((NEW.mt1 + NEW.mt2 + NEW.mt3) / 3);
      END IF;
    ELSIF NEW.level = 'CLASS_12' THEN
      -- Para a 12ª classe, o cálculo de mfd e mf depende de pt1, pt2 e nee
      NEW.mfd := CEIL((NEW.pt1 + NEW.pt2) / 2);  -- Arredondar por excesso
      IF NEW.nee IS NOT NULL THEN
        NEW.mf := CEIL(NEW.mfd * 0.6 + NEW.nee * 0.4);  -- Arredondar por excesso
      END IF;
    END IF;
  END IF;

  -- Contar o número de notas negativas para as disciplinas
  IF NEW.pf1 < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.pf2 < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.pft < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.ps1 < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.ps2 < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.pst < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.pt1 < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.pt2 < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  IF NEW.ptt < 10 THEN
    negative_count := negative_count + 1;
  END IF;

  -- Verificar a condição de aprovação
  IF negative_count = 0 THEN
    NEW.approved := 'APPROVED';
  ELSIF negative_count <= 2 THEN
    NEW.approved := 'WITH_DEFICIENCY';
  ELSE
    IF NEW.level = 'CLASS_11' OR NEW.level = 'CLASS_12' THEN
      IF NEW.ims < 10 THEN
        NEW.approved := 'FAILED';  -- Negativa em Prática para CLASS_11 ou CLASS_12
      END IF;
    ELSE
      NEW.approved := 'failed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar a trigger que chama a função acima
CREATE TRIGGER grades_update_trigger
BEFORE INSERT OR UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_grades();
