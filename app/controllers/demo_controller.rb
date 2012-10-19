class DemoController < ApplicationController
  def show
    @demo = params[:id]    
    respond_to do |format|
      format.html {
        case @demo
        when 1
            render :action => "demo_1"
        when 2
            render :action => "demo_1"
        when 3
            render :action => "demo_1"
        else
            render :action => "demo_1"
        end
      }
    end
  end

  def demo_1

  end

  def demo_2
  end

  def demo_3
  end
end
